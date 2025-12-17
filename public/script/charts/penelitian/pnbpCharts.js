// Chart configurations for Penelitian PNBP
import {
    createBarChartConfig,
    createDoughnutChartConfig,
    currencyFormatter
} from '../chartUtils.js';

export function getPNBPChartConfigs(pnbpData, translations) {
    return [
        createBarChartConfig(
            'pnbpPerTahun',
            pnbpData.jumlahPerTahun,
            translations.penelitianPage.charts.pnbp.pnbpPerTahun,
            {
                titleCallback: (tooltipItems) => translations.penelitianPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => context.parsed.y + " " + translations.home.charts.penelitian
            }
        ),
        createDoughnutChartConfig(
            'pnbpPerProdi',
            pnbpData.jumlahPerProdi,
            translations.penelitianPage.charts.pnbp.pnbpPerProdi,
            {
                labelCallback: (context) => context.parsed + " " + translations.home.charts.penelitian
            }
        ),
        createBarChartConfig(
            'pnbpDanaPerTahun',
            pnbpData.jumlahDanaPerTahun,
            translations.penelitianPage.charts.pnbp.pnbpDanaPerTahun,
            {
                titleCallback: (tooltipItems) => translations.penelitianPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => currencyFormatter(context.parsed.y),
                yAxisCallback: (value) => currencyFormatter(value)
            }
        ),
        createDoughnutChartConfig(
            'pnbpDanaPerProdi',
            pnbpData.jumlahDanaPerProdi,
            translations.penelitianPage.charts.pnbp.pnbpDanaPerProdi,
            {
                labelCallback: (context) => currencyFormatter(context.parsed)
            }
        ),
        createBarChartConfig(
            'pnbpAvgDanaPerTahun',
            pnbpData.avgDanaPerTahun,
            translations.penelitianPage.charts.pnbp.pnbpAvgDanaPerTahun,
            {
                dataKey: 'avg',
                titleCallback: (tooltipItems) => translations.penelitianPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => currencyFormatter(context.parsed.y),
                yAxisCallback: (value) => currencyFormatter(value)
            }
        ),
        createDoughnutChartConfig(
            'pnbpAvgDanaPerProdi',
            pnbpData.avgDanaPerProdi,
            translations.penelitianPage.charts.pnbp.pnbpAvgDanaPerProdi,
            {
                dataKey: 'avg',
                labelCallback: (context) => currencyFormatter(context.parsed)
            }
        ),
        createBarChartConfig(
            'pnbpAvgNilaiPerTahun',
            pnbpData.avgNilaiPerTahun,
            translations.penelitianPage.charts.pnbp.pnbpAvgNilaiPerTahun,
            {
                dataKey: 'avg',
                titleCallback: (tooltipItems) => translations.penelitianPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => Number(context.parsed.y).toFixed(2),
                yAxisCallback: (value) => Number(value).toFixed(2)
            }
        ),
        createDoughnutChartConfig(
            'pnbpAvgNilaiPerProdi',
            pnbpData.avgNilaiPerProdi,
            translations.penelitianPage.charts.pnbp.pnbpAvgNilaiPerProdi,
            {
                dataKey: 'avg',
                labelCallback: (context) => Number(context.parsed).toFixed(2)
            }
        )
    ];
}
