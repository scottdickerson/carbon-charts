import { Chart } from "../chart";
export declare const data: {
    labels: string[];
    datasets: {
        label: string;
        fillColors: any[];
        data: number[];
    }[];
};
export declare const options: {
    axes: {
        bottom: {
            title: string;
            type: string;
            primary: boolean;
        };
        left: {
            secondary: boolean;
        };
        top: {
            title: string;
        };
    };
    legendClickable: boolean;
    resizable: boolean;
    height: number;
    title: string;
};
export declare class TestEnvironment {
    chartOptions: {
        axes: {
            bottom: {
                title: string;
                type: string;
                primary: boolean;
            };
            left: {
                secondary: boolean;
            };
            top: {
                title: string;
            };
        };
        legendClickable: boolean;
        resizable: boolean;
        height: number;
        title: string;
    };
    chartData: {
        labels: string[];
        datasets: {
            label: string;
            fillColors: any[];
            data: number[];
        }[];
    };
    chart: Chart;
    render(): void;
    destroy(): void;
    setChartOptions(func: Function): void;
    getChartReference(): Chart;
}
