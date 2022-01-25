<script>
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import VueApexCharts from "vue3-apexcharts";
export default {
    components: { 
        apexchart: VueApexCharts,
        Listbox, 
        ListboxButton, 
        ListboxOptions, 
        ListboxOption,
    },
    data() {
        return {
            selected_reddit: 'r/CryptoCurrency',
            selected_cc: 'BTC/USD',
            reddits: ['r/CryptoCurrency', 'r/Bitcoin', 'r/ethereum', 'r/cardano'],
            cc: ['BTC/USD', 'ETH/USD', 'GLM/USD', 'GRT/USD'],
            data1: [30, 40, 35, 50, 49, 60, 70, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91],
            data2: [30, 40, 35, 50, 49, 60, 70, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91, 91]
        }
    },
    computed: {
        chartOptions() {
            return {
                chart: {
                    id: this.selected_cc,
                    toolbar: {
                        show: false,
                    },
                },
                stroke: {
                    curve: 'smooth',
                    lineCap: 'round',
                    width: 8
                },
                tooltip: {
                    enabled: true,
                    theme: 'dark',
                    x: {
                        show: false
                    }
                },
                xaxis: {
                    type: 'datetime',
                    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 1999.6, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007],
                },
                yaxis: [{
                    formatter: (val, index) => {
                        return Math.round(val)
                    },
                    axisBorder: {
                        show: true,
                    },
                    axisTicks: {
                        show: true,
                    },
                    tickAmount: 10
                },{
                    opposite: true,
                    formatter: (val, index) => {
                        return Math.round(val)
                    },
                    axisBorder: {
                        show: true,
                    },
                    axisTicks: {
                        show: true,
                    },
                    tickAmount: 10
                }],
                grid: {
                    show: false,
                },
                colors: ['#C084FC','#2DD4BF'],
                foreColor: '#9e00e2'
            }
        },
        series() {
            return [
                {
                    name: this.selected_reddit,
                    data: this.data1,
                },
                {
                    name: this.selected_cc,
                    data: this.data2,
                },
            ]
        },
    },
    methods: {
        resetData() {
            this.data1 = this.data1.map(x => Math.floor(100*Math.random()))
            this.data2 = this.data2.map(x => Math.floor(1000*Math.random()))
        }
    }

}
</script>

<template>
    <div class="flex pt-2 justify-center items-center gap-4">
        <!-- Reddit Selection -->
        <Listbox as="div" v-model="selected_reddit">
            <ListboxButton class="py-1 px-3 rounded-lg bg-dark-700">{{selected_reddit}}</ListboxButton>
            <ListboxOptions class="py-1 px-3 rounded-lg bg-dark-700 absolute z-40">
                <ListboxOption
                    v-for="r in reddits"
                    :key="r"
                    :value="r"
                    class="cursor-pointer"
                >
                    {{ r }}
                </ListboxOption>
            </ListboxOptions>
        </Listbox>

        <h2 class="text-violet-400">vs</h2>
        <!-- CC Selection -->
        <Listbox as="div" v-model="selected_cc">
            <ListboxButton class="py-1 px-3 rounded-lg bg-dark-700">{{selected_cc}}</ListboxButton>
            <ListboxOptions class="py-1 px-3 rounded-lg bg-dark-700 absolute">
                <ListboxOption
                    v-for="crypto in cc"
                    :key="crypto"
                    :value="crypto"
                >
                    {{ crypto }}
                </ListboxOption>
            </ListboxOptions>
        </Listbox>
    </div>
    <!-- Data -->
    <apexchart
        width="999"
        type="line"
        :options="chartOptions"
        :series="series"
    ></apexchart>
    <button class="bg-dark-400 rounded-lg px-2" @click="resetData"> Reset </button>
</template>

<style>
</style>