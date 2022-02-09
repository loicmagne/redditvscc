<script>
import Charts from './components/Charts.vue'
export default {
	data() {
		return {
			popover:false
		}
	},
	components: {
		Charts
	},
}
</script>

<template>
	<div class="text-white min-h-screen bg-dark-900 flex justify-center">
		<div class="mt-12 flex flex-col items-center">
			<!-- Title -->
			<div class="flex flex-row items-start">
				<h1 class="text-5xl">Reddit <span class="text-violet-400">vs</span> CC</h1>
				<div class="relative">
					<svg 
						xmlns="http://www.w3.org/2000/svg" 
						class="h-5 w-5 cursor-pointer mt-2 ml-1 text-gray-300"
						@mouseover="popover=true"
						@mouseout="popover=false"
						fill="none" viewBox="0 0 24 24" stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<div 
						v-if="popover" 
						class="absolute top-6 left-4 bg-dark-100 text-justify opacity-70 w-72 z-50 text-sm p-1 px-2 rounded-lg"> 
						redditvs.cc is a website which displays the number of active users of
						famous subreddits, against the USD price of several cryptocurrencies. Some subreddits
						don't have available historical data but are being updated everyday.
					</div>
				</div>
			</div>
			<Charts></Charts>
		</div>
	</div>
</template>

<style>
</style>
