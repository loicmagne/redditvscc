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
            subr_data: []
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

        this.loadRedditData(this.selected_reddit);
        this.loadCCData(this.selected_cc);
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
                    data: this.cc_data,
                },
                {
                    name: `r/${this.selected_reddit}`,
                    data: this.subr_data,
                },
            ]
        },
    },
    methods: {
        async loadRedditData(subreddit) {
            const docRef = doc(db, "reddit", "doc", "history", subreddit);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {this.subr_data = process_time_series(docSnap.data());}
            else {console.log("Couldn't load subreddit data");}
        },
        async loadCCData(crypto) {
            const docRef = doc(db, "crypto", "doc", "history", this.cc[crypto]);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {this.cc_data = process_time_series(docSnap.data());}
            else {console.log("Couldn't load crypto data");}
        }
    }

}
</script>

<template>
    <div class="flex pt-2 justify-center items-center gap-4">
        <!-- Reddit Selection -->
        <Listbox as="div" v-model="selected_reddit">
            <ListboxButton class="py-1 px-3 rounded-lg bg-dark-700">r/{{selected_reddit}}</ListboxButton>
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
            <ListboxButton class="py-1 px-3 rounded-lg bg-dark-700">{{selected_cc}}</ListboxButton>
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
    </div>
    <!-- Data -->
    <apexchart
        width="1000"
        type="line"
        :options="chartOptions"
        :series="series"
    ></apexchart>
    <button class="bg-dark-400 rounded-lg px-2" @click="resetData"> Reset </button>
</template>

<style>
</style>