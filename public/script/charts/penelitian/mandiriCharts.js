// Chart configurations for Penelitian Mandiri
import {
    createBarChartConfig,
    createDoughnutChartConfig
} from '../chartUtils.js';

export function getMandiriChartConfigs(mandiriData, translations) {
    return [
        createBarChartConfig(
            'mandiriPerTahun',
            mandiriData.jumlahPerTahun,
            translations.penelitianPage.charts.mandiri.mandiriPerTahun,
            {
                titleCallback: (tooltipItems) => translations.penelitianPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => context.parsed.y + " " + translations.home.charts.penelitian
            }
        ),
        createDoughnutChartConfig(
            'mandiriPerProdi',
            mandiriData.jumlahPerProdi,
            translations.penelitianPage.charts.mandiri.mandiriPerProdi,
            {
                labelCallback: (context) => context.parsed + " " + translations.home.charts.penelitian
            }
        )
    ];
}
