/**
 * Migration: Standardize Field Name Casing
 * 
 * Renames existing MongoDB document fields from mixed casing
 * (UPPERCASE, lowercase, snake_case) to consistent PascalCase.
 * 
 * IMPORTANT: Back up your database before running!
 */

/**
 * Each entry: { collection, renames: { oldField: newField } }
 * Defined at module scope (not inside the export object) so that
 * up() and down() can access it via closure without relying on `this`,
 * which loses its context when the function is extracted by the runner.
 */
const renameMap = [
    {
        collection: 'penelitianPusat',
        renames: {
            'SKEMA': 'Skema',
            'NAMA': 'Nama',
            'BIAYA': 'Biaya',
            'TAHUN': 'Tahun',
        },
    },
    {
        collection: 'penelitianPNBP',
        renames: {
            'SKEMA': 'Skema',
        },
    },
    {
        collection: 'penelitianMandiri',
        renames: {
            'tahun': 'Tahun',
        },
    },
    {
        collection: 'pengabdianPusat',
        renames: {
            'SKEMA': 'Skema',
        },
    },
    {
        collection: 'pengabdianPNBP',
        renames: {
            'SKEMA': 'Skema',
        },
    },
    {
        collection: 'publikasiBuku',
        renames: {
            'buku_isbn': 'BukuIsbn',
            'buku_jumlah_halaman': 'BukuJumlahHalaman',
            'buku_penerbit': 'BukuPenerbit',
            'buku_file': 'BukuFile',
            'buku_tahun': 'Tahun',
            'pengguna_kode': 'PenggunaKode',
            '_pengguna_jenis': 'PenggunaJenis',
            '_pengguna_nama': 'PenggunaNama',
        },
    },
    {
        collection: 'publikasiHAKI',
        renames: {
            'hki_jenis': 'HkiJenis',
            'hki_file': 'HkiFile',
            'hki_bulan': 'HkiBulan',
            'hki_tahun': 'Tahun',
            'pengguna_kode': 'PenggunaKode',
            '_pengguna_nama': 'PenggunaNama',
        },
    },
    {
        collection: 'publikasiJupeng',
        renames: {
            'jurnal_url': 'JurnalUrl',
            'jurnal_file': 'JurnalFile',
            'jurnal_tahun': 'Tahun',
            'jurnal_bulan': 'JurnalBulan',
            'pengguna_kode': 'PenggunaKode',
            '_pengguna_jenis': 'PenggunaJenis',
            '_pengguna_nama': 'PenggunaNama',
            '_personil_data_ketua': 'PersonilDataKetua',
            '_personil_data_ketua_kode': 'PersonilDataKetuaKode',
            '_personil_data_ketua_jenis': 'PersonilDataKetuaJenis',
        },
    },
];

module.exports = {
    name: '1-migrateFieldNames',
    description: 'Standardize field name casing to PascalCase across all collections',

    async up(db) {
        for (const { collection, renames } of renameMap) {
            console.log(`    --- Collection: ${collection} ---`);
            const col = db.collection(collection);
            const docCount = await col.countDocuments();
            console.log(`      Total documents: ${docCount}`);

            for (const [oldField, newField] of Object.entries(renames)) {
                const affectedCount = await col.countDocuments({ [oldField]: { $exists: true } });

                if (affectedCount === 0) {
                    console.log(`      ${oldField} → ${newField}: No documents to update (skipped)`);
                    continue;
                }

                console.log(`      ${oldField} → ${newField}: ${affectedCount} document(s) affected`);
                const result = await col.updateMany(
                    { [oldField]: { $exists: true } },
                    { $rename: { [oldField]: newField } }
                );
                console.log(`      ✅ Renamed ${result.modifiedCount} document(s)`);
            }
        }
    },

    async down(db) {
        // Reverse: rename PascalCase back to original casing
        for (const { collection, renames } of renameMap) {
            console.log(`    --- Rollback Collection: ${collection} ---`);
            const col = db.collection(collection);

            for (const [oldField, newField] of Object.entries(renames)) {
                const affectedCount = await col.countDocuments({ [newField]: { $exists: true } });

                if (affectedCount === 0) {
                    console.log(`      ${newField} → ${oldField}: No documents to rollback (skipped)`);
                    continue;
                }

                console.log(`      ${newField} → ${oldField}: ${affectedCount} document(s)`);
                const result = await col.updateMany(
                    { [newField]: { $exists: true } },
                    { $rename: { [newField]: oldField } }
                );
                console.log(`      ✅ Rolled back ${result.modifiedCount} document(s)`);
            }
        }
    },
};
