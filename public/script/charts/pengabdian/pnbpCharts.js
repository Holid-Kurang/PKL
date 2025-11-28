// Chart configurations for Pengabdian PNBP
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
            translations.pengabdianPage.charts.pnbp.pnbpPerTahun,
            {
                titleCallback: (tooltipItems) => translations.pengabdianPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => context.parsed.y + " " + translations.home.charts.pengabdian
            }
        ),
        createDoughnutChartConfig(
            'pnbpPerProdi',
            pnbpData.jumlahPerProdi,
            translations.pengabdianPage.charts.pnbp.pnbpPerProdi,
            {
                labelCallback: (context) => context.parsed + " " + translations.home.charts.pengabdian
            }
        ),
        createBarChartConfig(
            'pnbpDanaPerTahun',
            pnbpData.jumlahDanaPerTahun,
            translations.pengabdianPage.charts.pnbp.pnbpDanaPerTahun,
            {
                titleCallback: (tooltipItems) => translations.pengabdianPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => currencyFormatter(context.parsed.y),
                yAxisCallback: (value) => currencyFormatter(value)
            }
        ),
        createDoughnutChartConfig(
            'pnbpDanaPerProdi',
            pnbpData.jumlahDanaPerProdi,
            translations.pengabdianPage.charts.pnbp.pnbpDanaPerProdi,
            {
                labelCallback: (context) => currencyFormatter(context.parsed)
            }
        ),
        createBarChartConfig(
            'pnbpAvgDanaPerTahun',
            pnbpData.avgDanaPerTahun,
            translations.pengabdianPage.charts.pnbp.pnbpAvgDanaPerTahun,
            {
                dataKey: 'avg',
                titleCallback: (tooltipItems) => translations.pengabdianPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => currencyFormatter(context.parsed.y),
                yAxisCallback: (value) => currencyFormatter(value)
            }
        ),
        createDoughnutChartConfig(
            'pnbpAvgDanaPerProdi',
            pnbpData.avgDanaPerProdi,
            translations.pengabdianPage.charts.pnbp.pnbpAvgDanaPerProdi,
            {
                dataKey: 'avg',
                labelCallback: (context) => currencyFormatter(context.parsed)
            }
        ),
        createBarChartConfig(
            'pnbpAvgNilaiPerTahun',
            pnbpData.avgNilaiPerTahun,
            translations.pengabdianPage.charts.pnbp.pnbpAvgNilaiPerTahun,
            {
                dataKey: 'avg',
                titleCallback: (tooltipItems) => translations.pengabdianPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => Number(context.parsed.y).toFixed(2),
                yAxisCallback: (value) => Number(value).toFixed(2)
            }
        ),
        createDoughnutChartConfig(
            'pnbpAvgNilaiPerProdi',
            pnbpData.avgNilaiPerProdi,
            translations.pengabdianPage.charts.pnbp.pnbpAvgNilaiPerProdi,
            {
                dataKey: 'avg',
                labelCallback: (context) => Number(context.parsed).toFixed(2)
            }
        )
    ];
}
