// Chart configurations for Jurnal Pengabdian (JUPENG)
import {
    createBarChartConfig,
    createDoughnutChartConfig
} from '../chartUtils.js';

export function getJupengChartConfigs(jupengData, translations) {
    return [
        createBarChartConfig(
            'jupengPerTahun',
            jupengData.jumlahPerTahun,
            translations.publikasiPage.charts.jupeng.jupengPerTahun,
            {
                dataKey: 'totalPublikasi',
                titleCallback: (tooltipItems) => translations.publikasiPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => context.parsed.y + " " + translations.home.charts.publikasi
            }
        ),
        createDoughnutChartConfig(
            'jupengPerProdi',
            jupengData.jumlahPerProdi,
            translations.publikasiPage.charts.jupeng.jupengPerProdi,
            {
                dataKey: 'count',
                labelCallback: (context) => context.parsed + " " + translations.home.charts.publikasi,
                legendPosition: 'bottom'
            }
        )
    ];
}
