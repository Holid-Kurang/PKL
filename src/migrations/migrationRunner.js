/**
 * Migration Runner for MongoDB/Mongoose
 * 
 * Tracks executed migrations in a `_migrations` collection to prevent
 * double-runs. Supports: up, down, status, dry-run, create.
 * 
 * Usage:
 *   node src/migrations/migrationRunner.js up          # Run pending migrations
 *   node src/migrations/migrationRunner.js down         # Rollback last migration
 *   node src/migrations/migrationRunner.js status       # Show migration status
 *   node src/migrations/migrationRunner.js dry-run      # Preview pending migrations
 *   node src/migrations/migrationRunner.js create <name> # Create new migration file
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// ─── Configuration ───────────────────────────────────────────────
const MIGRATIONS_DIR = __dirname;
const MIGRATION_COLLECTION = '_migrations';

// Files to ignore when scanning for migration files
const IGNORE_FILES = [
    'migrationRunner.js',
    'TEMPLATE.js',
];

// ─── Migration Record Schema ────────────────────────────────────
const MigrationRecordSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    executedAt: { type: Date, default: Date.now },
    duration: { type: Number }, // milliseconds
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
}, {
    collection: MIGRATION_COLLECTION,
    timestamps: false,
});

let MigrationRecord;

// ─── Helpers ────────────────────────────────────────────────────

/**
 * Connect to MongoDB using the same config as the app.
 */
async function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('ERROR: MONGODB_URI is not set in environment variables.');
        console.error('Make sure your .env file has MONGODB_URI defined.');
        process.exit(1);
    }

    await mongoose.connect(uri, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
    });

    // Register model after connection
    MigrationRecord = mongoose.model('MigrationRecord', MigrationRecordSchema);

    console.log(`✔ Connected to MongoDB: ${mongoose.connection.host}`);
}

/**
 * Disconnect from MongoDB.
 */
async function disconnectDB() {
    await mongoose.disconnect();
    console.log('✔ Disconnected from MongoDB.');
}

/**
 * Get all migration files sorted by filename (numeric prefix order).
 */
function getMigrationFiles() {
    const files = fs.readdirSync(MIGRATIONS_DIR)
        .filter(f => f.endsWith('.js') && !IGNORE_FILES.includes(f))
        .sort((a, b) => {
            // Sort by numeric prefix: "1-xxx.js" < "2-yyy.js" < "10-zzz.js"
            const numA = parseInt(a.split('-')[0], 10) || 0;
            const numB = parseInt(b.split('-')[0], 10) || 0;
            return numA - numB;
        });

    return files;
}

/**
 * Load a migration module and validate its structure.
 */
function loadMigration(filename) {
    const fullPath = path.join(MIGRATIONS_DIR, filename);
    const migration = require(fullPath);

    // Validate structure
    if (typeof migration.up !== 'function') {
        throw new Error(`Migration "${filename}" must export an 'up' function.`);
    }

    return {
        name: migration.name || path.basename(filename, '.js'),
        description: migration.description || '',
        up: migration.up,
        down: migration.down || null,
        filename,
    };
}

/**
 * Get names of migrations already executed.
 */
async function getExecutedMigrations() {
    const records = await MigrationRecord.find({}).sort({ executedAt: 1 }).lean();
    return records;
}

// ─── Commands ───────────────────────────────────────────────────

/**
 * Run all pending migrations.
 */
async function runUp(isDryRun = false) {
    const mode = isDryRun ? '🔍 DRY RUN' : '🚀 LIVE RUN';
    console.log(`\n═══ Migration UP (${mode}) ═══\n`);

    const files = getMigrationFiles();
    const executed = await getExecutedMigrations();
    const executedNames = new Set(executed.map(r => r.name));

    const pending = files
        .map(f => loadMigration(f))
        .filter(m => !executedNames.has(m.name));

    if (pending.length === 0) {
        console.log('✔ No pending migrations. Database is up to date.\n');
        return;
    }

    console.log(`Found ${pending.length} pending migration(s):\n`);

    for (const migration of pending) {
        console.log(`  ▶ ${migration.name}`);
        if (migration.description) {
            console.log(`    ${migration.description}`);
        }

        if (!isDryRun) {
            const startTime = Date.now();
            try {
                const db = mongoose.connection.db;
                await migration.up(db, mongoose);

                const duration = Date.now() - startTime;
                await MigrationRecord.create({
                    name: migration.name,
                    description: migration.description,
                    duration,
                    status: 'success',
                });

                console.log(`    ✅ Completed in ${duration}ms`);
            } catch (error) {
                const duration = Date.now() - startTime;
                console.error(`    ❌ FAILED after ${duration}ms:`, error.message);

                // Record failure
                await MigrationRecord.create({
                    name: migration.name,
                    description: migration.description,
                    duration,
                    status: 'failed',
                });

                console.error('\n⚠ Migration halted due to error. Fix the issue and retry.');
                process.exit(1);
            }
        }
    }

    console.log(`\n✔ ${isDryRun ? 'Dry run complete. No changes were made.' : `${pending.length} migration(s) executed successfully.`}\n`);
}

/**
 * Rollback the last executed migration.
 */
async function runDown() {
    console.log('\n═══ Migration DOWN (Rollback) ═══\n');

    const executed = await getExecutedMigrations();
    if (executed.length === 0) {
        console.log('✔ No migrations to rollback.\n');
        return;
    }

    // Get the last successful migration
    const lastRecord = [...executed].reverse().find(r => r.status === 'success');
    if (!lastRecord) {
        console.log('✔ No successful migrations to rollback.\n');
        return;
    }

    // Find the migration file
    const files = getMigrationFiles();
    const matchingFile = files.find(f => {
        const m = loadMigration(f);
        return m.name === lastRecord.name;
    });

    if (!matchingFile) {
        console.error(`❌ Migration file for "${lastRecord.name}" not found.`);
        process.exit(1);
    }

    const migration = loadMigration(matchingFile);

    if (!migration.down) {
        console.error(`❌ Migration "${migration.name}" does not have a 'down' (rollback) function.`);
        console.error('   Manual rollback required.');
        process.exit(1);
    }

    console.log(`  ▼ Rolling back: ${migration.name}`);

    const startTime = Date.now();
    try {
        const db = mongoose.connection.db;
        await migration.down(db, mongoose);

        const duration = Date.now() - startTime;

        // Remove the migration record
        await MigrationRecord.deleteOne({ name: migration.name });

        console.log(`    ✅ Rolled back in ${duration}ms`);
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`    ❌ Rollback FAILED after ${duration}ms:`, error.message);
        process.exit(1);
    }

    console.log('\n✔ Rollback complete.\n');
}

/**
 * Show the status of all migrations.
 */
async function showStatus() {
    console.log('\n═══ Migration Status ═══\n');

    const files = getMigrationFiles();
    const executed = await getExecutedMigrations();
    const executedMap = new Map(executed.map(r => [r.name, r]));

    let pendingCount = 0;

    for (const file of files) {
        const migration = loadMigration(file);
        const record = executedMap.get(migration.name);

        if (record) {
            const date = record.executedAt.toISOString().replace('T', ' ').slice(0, 19);
            const statusIcon = record.status === 'success' ? '✅' : '❌';
            const duration = record.duration ? ` (${record.duration}ms)` : '';
            console.log(`  ${statusIcon} ${migration.name} — ${date}${duration}`);
        } else {
            console.log(`  ⏳ ${migration.name} — PENDING`);
            pendingCount++;
        }
    }

    console.log(`\n  Total: ${files.length} | Executed: ${files.length - pendingCount} | Pending: ${pendingCount}\n`);
}

/**
 * Create a new migration file from the template.
 */
function createMigration(name) {
    if (!name) {
        console.error('ERROR: Please provide a migration name.');
        console.error('Usage: npm run migrate:create -- <name>');
        console.error('Example: npm run migrate:create -- add-prodi-index');
        process.exit(1);
    }

    // Sanitize name
    const sanitizedName = name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();

    // Determine next number
    const files = getMigrationFiles();
    let nextNum = 1;
    if (files.length > 0) {
        const lastFile = files[files.length - 1];
        const lastNum = parseInt(lastFile.split('-')[0], 10) || 0;
        nextNum = lastNum + 1;
    }

    const filename = `${nextNum}-${sanitizedName}.js`;
    const filepath = path.join(MIGRATIONS_DIR, filename);

    // Read template
    const templatePath = path.join(MIGRATIONS_DIR, 'TEMPLATE.js');
    let content;
    if (fs.existsSync(templatePath)) {
        content = fs.readFileSync(templatePath, 'utf-8')
            .replace(/TEMPLATE_NAME/g, `${nextNum}-${sanitizedName}`)
            .replace(/TEMPLATE_DESCRIPTION/g, `Migration: ${sanitizedName}`);
    } else {
        // Fallback template
        content = `/**
 * Migration: ${sanitizedName}
 * Created: ${new Date().toISOString()}
 */

module.exports = {
    name: '${nextNum}-${sanitizedName}',
    description: 'TODO: Describe what this migration does',

    async up(db, mongoose) {
        // TODO: Implement forward migration
    },

    async down(db, mongoose) {
        // TODO: Implement rollback
    },
};
`;
    }

    fs.writeFileSync(filepath, content);
    console.log(`\n✔ Created migration: ${filename}`);
    console.log(`  Path: ${filepath}\n`);
}

// ─── Main Entry Point ───────────────────────────────────────────

async function main() {
    const command = process.argv[2] || 'up';
    const arg = process.argv[3];

    // 'create' doesn't need DB connection
    if (command === 'create') {
        createMigration(arg);
        return;
    }

    try {
        await connectDB();

        switch (command) {
            case 'up':
                await runUp(false);
                break;
            case 'dry-run':
                await runUp(true);
                break;
            case 'down':
                await runDown();
                break;
            case 'status':
                await showStatus();
                break;
            default:
                console.error(`Unknown command: "${command}"`);
                console.error('Available commands: up, down, status, dry-run, create');
                process.exit(1);
        }
    } finally {
        await disconnectDB();
    }
}

main().catch((err) => {
    console.error('Migration runner failed:', err);
    process.exit(1);
});
