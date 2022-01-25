<script>
import Charts from './components/Charts.vue'
export default {
  components: {
	Charts
  },
}
</script>

<template>
	<div class="text-white min-h-screen bg-dark-900 flex justify-center">
		<div class="mt-12 flex flex-col items-center">
			<!-- Title -->
			<h1 class="text-5xl">Reddit <span class="text-violet-400">vs</span> CC</h1>
			<Charts></Charts>
		</div>
	</div>
</template>

<style>
</style>
