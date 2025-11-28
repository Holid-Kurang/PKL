// Chart configurations for HAKI
import {
    createBarChartConfig,
    createDoughnutChartConfig
} from '../chartUtils.js';

export function getHAKIChartConfigs(hakiData, translations) {
    return [
        createDoughnutChartConfig(
            'hakiPerJenis',
            hakiData.jumlahPerJenis,
            translations.publikasiPage.charts.haki.hakiPerJenis,
            {
                dataKey: 'jumlahHKI',
                labelCallback: (context) => context.parsed + " " + translations.categories.haki,
                legendPosition: 'left'
            }
        ),
        createDoughnutChartConfig(
            'hakiPerProdi',
            hakiData.jumlahPerProdi,
            translations.publikasiPage.charts.haki.hakiPerProdi,
            {
                dataKey: 'jumlahHKI',
                labelCallback: (context) => context.parsed + " " + translations.categories.haki
            }
        ),
        createBarChartConfig(
            'hakiPerTahun',
            hakiData.jumlahPerTahun,
            translations.publikasiPage.charts.haki.hakiPerTahun,
            {
                dataKey: 'jumlahHKI',
                titleCallback: (tooltipItems) => translations.publikasiPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => context.parsed.y + " " + translations.categories.haki
            }
        )
    ];
}
