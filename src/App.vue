<script>
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
export default {
  components: { 
    Listbox, 
    ListboxButton, 
    ListboxOptions, 
    ListboxOption 
  },
  data() {
		return {
			selected_reddit: 'r/CryptoCurrency',
			selected_cc: 'BTC/USD',
			reddits: ['r/CryptoCurrency', 'r/Bitcoin', 'r/ethereum', 'r/cardano'],
			cc: ['BTC/USD', 'ETH/USD', 'GLM/USD', 'GRT/USD'],
		}
  }
}
</script>

<template>
  <div class="text-white min-h-screen bg-dark-900 flex justify-center">
    <div class="mt-12 flex flex-col items-center">
			<!-- Title -->
      <h1 class="text-6xl">Reddit <span class="text-violet-400">vs</span> CC</h1>
			<div class="flex py-2 justify-center items-center gap-4">
				<!-- Reddit Selection -->
				<Listbox as="div" v-model="selected_reddit">
					<ListboxButton class="py-1 px-3 rounded-lg bg-dark-700">{{selected_reddit}}</ListboxButton>
					<ListboxOptions class="py-1 px-3 rounded-lg bg-dark-700 absolute">
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
			<div class="w-96 h-96 bg-fuchsia-400">

			</div>
    </div>
  </div>
</template>

<style>
</style>
