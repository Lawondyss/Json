<script lang="ts">
	let {text, query}: { text: string; query: string } = $props();

	const parts = $derived.by(() => {
		if (!query) return [text];
		return text.split(new RegExp(`(${query})`, 'gi'));
	});
</script>

<span>
	{#each parts as part}
		{#if part.toLowerCase() === query.toLowerCase()}
			<mark>{part}</mark>
		{:else}
			{part}
		{/if}
	{/each}
</span>

<style>
	mark {
		background-color: rgba(234, 179, 8, 0.4);
		color: var(--color-text-bright);
		border-radius: var(--radius-xs);
		padding-inline: var(--radius-xs);
	}
</style>
