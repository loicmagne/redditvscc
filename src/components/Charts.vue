<script>
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import VueApexCharts from "vue3-apexcharts"
import { db } from "../firebase/firebaseinit"
import { collection, getDoc, doc } from "firebase/firestore";
import { process_time_series } from "../utils"

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
            selected_reddit: 'Bitcoin',
            selected_cc: 'Bitcoin',
            assoc_subr: null,
            inde_subr: null,
            cc: null,
            cc_data: [],
            subr_data: [],
            interval: 'max',
            loading: false,
            timeframes: {
                '7D': 7,
                '1M': 31,
                '3M': 90,
                '1Y': 365,
                'max': null
            }
        }
    },
    async created() {
        // Get list of cryptos
        const docRef = doc(db, "assets", "cryptos");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {this.cc = docSnap.data();}
        else {console.log("Couldn't load crypto list ");}
        // Get list of cryptos
        const docRef1 = doc(db, "assets", "associated_subreddits");
        const docRef2 = doc(db, "assets", "independent_subreddits");
        const docSnap1 = await getDoc(docRef1);
        const docSnap2 = await getDoc(docRef2);
        if (docSnap1.exists() && docSnap2.exists()) {
            this.assoc_subr = docSnap1.data();
            this.inde_subr = docSnap2.data();
        }
        else {console.log("Couldn't load subreddit list ");}

        await this.loadRedditData(this.selected_reddit);
        await this.loadCCData(this.selected_cc);
    },
    computed: {
        chartOptions() {
            return {
                chart: {
                    foreColor: '#ffffff',
                    id: this.selected_cc,
                    animations: {
                        enabled: false
                    },
                    toolbar: {
                        show: false,
                    },
                },
                stroke: {
                    curve: 'straight',
                    lineCap: 'round',
                    width: 2
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
                },
                yaxis: [{
                    decimalsInFloat: 0,
                    axisBorder: {
                        show: true,
                    },
                    axisTicks: {
                        show: true,
                    },
                    tickAmount: 10,
                    title: {
                        text: 'USD',
                    }
                },{
                    decimalsInFloat: 0,
                    opposite: true,
                    axisBorder: {
                        show: true,
                    },
                    axisTicks: {
                        show: true,
                    },
                    tickAmount: 10,
                    title: {
                        text: 'Active Members',
                    }
                }],
                legend: {
                fontSize: "16px"
                },
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
                    name: this.selected_cc,
                    data: this.cc_data.slice(-this.timeframe),
                },
                {
                    name: `r/${this.selected_reddit}`,
                    data: this.subr_data.slice(-this.timeframe),
                },
            ]
        },
        cc_list() {return Object.keys(this.cc)},
        subr_list() {return Object.keys({... this.assoc_subr, ... this.inde_subr})},
        cc_len() {return this.cc_list.length},
        subr_len() {return this.subr_list.length},
        min_length() {
            // Return the size of the intersection of the intervals of cc_data and subr_data
            return Math.min(this.cc_data.length, this.subr_data.length)
        },
        timeframe() {
            if (this.timeframes[this.interval] === null) {return this.min_length}
            else {
                return Math.min(this.timeframes[this.interval], this.min_length)
            }
        }
    },
    methods: {
        async loadRedditData(subreddit) {
            this.loading = true
            const docRef = doc(db, "reddit", "doc", "history", subreddit);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {this.subr_data = process_time_series(docSnap.data());}
            else {console.log("Couldn't load subreddit data");}
            this.loading = false
        },
        async loadCCData(crypto) {
            this.loading = true
            const docRef = doc(db, "crypto", "doc", "history", this.cc[crypto]);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {this.cc_data = process_time_series(docSnap.data());}
            else {console.log("Couldn't load crypto data");}
            this.loading = false
        },
        async randomize() {
            let random_cc = this.cc_list[Math.floor(this.cc_len * Math.random())]
            let random_subr = this.subr_list[Math.floor(this.subr_len * Math.random())]

            this.selected_cc = random_cc
            this.selected_reddit = (random_subr in this.inde_subr) ? this.inde_subr[random_subr] : this.assoc_subr[random_subr]

            await this.loadRedditData(this.selected_reddit);
            await this.loadCCData(this.selected_cc);
        }
    }

}
</script>

<template>
    <div class="flex pt-2 justify-center items-center gap-4 relative">
        <!-- Reddit Selection -->
        <Listbox as="div" v-model="selected_reddit">
            <ListboxButton class="py-1 px-3 rounded-lg bg-dark-400">r/{{selected_reddit}}</ListboxButton>
            <ListboxOptions class="py-1 px-3 rounded-lg bg-dark-700 absolute z-40">
                <ListboxOption
                    v-for="[id, r] of Object.entries({... assoc_subr, ... inde_subr})"
                    :key="id"
                    :value="r"
                    @click="loadRedditData(r)"
                    class="cursor-pointer"
                >
                    r/{{ r }}
                </ListboxOption>
            </ListboxOptions>
        </Listbox>

        <h2 class="text-violet-400">vs</h2>
        <!-- CC Selection -->
        <Listbox as="div" v-model="selected_cc">
            <ListboxButton class="py-1 px-3 rounded-lg bg-dark-400">{{selected_cc}}</ListboxButton>
            <ListboxOptions class="py-1 px-3 rounded-lg bg-dark-700 absolute z-40">
                <ListboxOption
                    v-for="[crypto, id] of Object.entries(cc)"
                    :key="id"
                    :value="crypto"
                    @click="loadCCData(crypto)"
                    class="cursor-pointer"
                >
                    {{ crypto }}
                </ListboxOption>
            </ListboxOptions>
        </Listbox>

        <svg v-if="loading" class="animate-spin absolute -right-9 h-5 w-5 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
    <!-- Data -->
    <apexchart
        width="1000"
        type="line"
        :options="chartOptions"
        :series="series"
    ></apexchart>

    <!-- Options -->
    <div class="flex flex-row gap-2">
        <!-- Timeframe selection -->
        <Listbox as="div" v-model="interval">
            <ListboxButton class="px-2 rounded-lg bg-dark-400">timeframe: {{interval}}</ListboxButton>
            <ListboxOptions class="px-2 rounded-lg bg-dark-700 absolute z-40">
                <ListboxOption
                    v-for="[tf, nb] of Object.entries(timeframes)"
                    :key="nb"
                    :value="tf"
                    class="cursor-pointer"
                >
                    {{ tf }}
                </ListboxOption>
            </ListboxOptions>
        </Listbox>

        <!-- Random pair -->
        <button class="bg-dark-400 rounded-lg px-2" @click="randomize"> random pair </button>
        
    </div>
</template>

<style>
</style>