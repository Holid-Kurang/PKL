// Chart configurations for Buku
import {
    createBarChartConfig,
    createDoughnutChartConfig
} from '../chartUtils.js';

export function getBukuChartConfigs(bukuData, translations) {
    return [
        createBarChartConfig(
            'bukuPerTahun',
            bukuData.jumlahPerTahun,
            translations.publikasiPage.charts.buku.bukuPerTahun,
            {
                dataKey: 'jumlahBuku',
                titleCallback: (tooltipItems) => translations.publikasiPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => context.parsed.y + " " + translations.categories.buku
            }
        ),
        createDoughnutChartConfig(
            'bukuPerProdi',
            bukuData.jumlahPerProdi,
            translations.publikasiPage.charts.buku.bukuPerProdi,
            {
                dataKey: 'jumlahBuku',
                labelCallback: (context) => context.parsed + " " + translations.categories.buku,
                legendPosition: 'bottom'
            }
        )
    ];
}
