/**
 * Migration: TEMPLATE_NAME
 * Created: TEMPLATE_DATE
 * 
 * TEMPLATE_DESCRIPTION
 * 
 * Instructions:
 *   1. Copy this file or use `npm run migrate:create -- <name>`
 *   2. Implement the `up()` function for forward migration
 *   3. Implement the `down()` function for rollback (recommended)
 *   4. Test with: npm run migrate:dry-run
 *   5. Execute with: npm run migrate
 */

module.exports = {
    name: 'TEMPLATE_NAME',
    description: 'TEMPLATE_DESCRIPTION',

    /**
     * Forward migration.
     * @param {import('mongodb').Db} db - Native MongoDB database instance
     * @param {import('mongoose')} mongoose - Mongoose instance
     * 
     * Common operations:
     * 
     *   // Rename fields
     *   await db.collection('myCollection').updateMany(
     *       { oldField: { $exists: true } },
     *       { $rename: { 'oldField': 'NewField' } }
     *   );
     * 
     *   // Add field with default value
     *   await db.collection('myCollection').updateMany(
     *       { newField: { $exists: false } },
     *       { $set: { newField: 'default_value' } }
     *   );
     * 
     *   // Remove a field
     *   await db.collection('myCollection').updateMany(
     *       {},
     *       { $unset: { obsoleteField: '' } }
     *   );
     * 
     *   // Change data type (e.g., String → Number)
     *   const docs = await db.collection('myCollection').find({ year: { $type: 'string' } }).toArray();
     *   for (const doc of docs) {
     *       await db.collection('myCollection').updateOne(
     *           { _id: doc._id },
     *           { $set: { year: parseInt(doc.year, 10) } }
     *       );
     *   }
     * 
     *   // Create an index
     *   await db.collection('myCollection').createIndex({ fieldName: 1 });
     */
    async up(db, mongoose) {
        // TODO: Implement forward migration
        throw new Error('Migration not implemented yet. Remove this line and add your migration logic.');
    },

    /**
     * Rollback migration (undo the changes made in `up`).
     * @param {import('mongodb').Db} db - Native MongoDB database instance
     * @param {import('mongoose')} mongoose - Mongoose instance
     */
    async down(db, mongoose) {
        // TODO: Implement rollback
        throw new Error('Rollback not implemented yet. Remove this line and add your rollback logic.');
    },
};
