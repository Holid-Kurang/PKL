// Chart configurations for Pengabdian Pusat
import {
    createBarChartConfig,
    createDoughnutChartConfig,
    currencyFormatter
} from '../chartUtils.js';

export function getPusatChartConfigs(pusatData, translations) {
    return [
        createBarChartConfig(
            'pusatPerTahun',
            pusatData.jumlahPerTahun,
            translations.pengabdianPage.charts.pusat.pusatPerTahun,
            {
                titleCallback: (tooltipItems) => translations.pengabdianPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => context.parsed.y + " " + translations.home.charts.pengabdian
            }
        ),
        createDoughnutChartConfig(
            'pusatPerProdi',
            pusatData.jumlahPerProdi,
            translations.pengabdianPage.charts.pusat.pusatPerProdi,
            {
                labelCallback: (context) => context.parsed + " " + translations.home.charts.pengabdian
            }
        ),
        createBarChartConfig(
            'pusatDanaPerTahun',
            pusatData.jumlahDanaPerTahun,
            translations.pengabdianPage.charts.pusat.pusatDanaPerTahun,
            {
                titleCallback: (tooltipItems) => translations.pengabdianPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => currencyFormatter(context.parsed.y),
                yAxisCallback: (value) => currencyFormatter(value)
            }
        ),
        createDoughnutChartConfig(
            'pusatDanaPerProdi',
            pusatData.jumlahDanaPerProdi,
            translations.pengabdianPage.charts.pusat.pusatDanaPerProdi,
            {
                labelCallback: (context) => currencyFormatter(context.parsed)
            }
        ),
        createBarChartConfig(
            'pusatAvgDanaPerTahun',
            pusatData.avgDanaPerTahun,
            translations.pengabdianPage.charts.pusat.pusatAvgDanaPerTahun,
            {
                dataKey: 'avg',
                titleCallback: (tooltipItems) => translations.pengabdianPage.tahun + " " + tooltipItems[0].label,
                labelCallback: (context) => currencyFormatter(context.parsed.y),
                yAxisCallback: (value) => currencyFormatter(value)
            }
        ),
        createDoughnutChartConfig(
            'pusatAvgDanaPerProdi',
            pusatData.avgDanaPerProdi,
            translations.pengabdianPage.charts.pusat.pusatAvgDanaPerProdi,
            {
                dataKey: 'avg',
                labelCallback: (context) => currencyFormatter(context.parsed)
            }
        )
    ];
}
