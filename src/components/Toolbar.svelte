<script lang="ts">
	import {Check, Copy, Search, X} from 'lucide-svelte';

	interface Props {
		selectedPath: string;
		pathCopied: boolean;
		onCopyPath: () => void;
		filterQuery: string;
		setFilterQuery: (query: string) => void;
		searchQuery: string;
		setSearchQuery: (query: string) => void;
	}

	let {
		selectedPath,
		pathCopied,
		onCopyPath,
		filterQuery = $bindable(),
		setFilterQuery,
		searchQuery = $bindable(),
		setSearchQuery
	}: Props = $props();
</script>

<div class="toolbar">
	<div class="toolbar-left">
		<div class="path-bar">
			<div class="path-label">Path</div>
			<div class="path-content">
				{#if selectedPath}
					{selectedPath}
				{:else}
					<span class="placeholder italic">Click on an element to see its path</span>
				{/if}
			</div>
			{#if selectedPath}
				<button
					onclick={onCopyPath}
					class="copy-btn"
					title="Copy Path"
				>
					{#if pathCopied}
						<Check size={16} class="success-icon"/>
					{:else}
						<Copy size={16}/>
					{/if}
				</button>
			{/if}
		</div>
		<div class="filter-bar">
			<div class="filter-label">Filter</div>
			<input
				type="text"
				bind:value={filterQuery}
				placeholder="root.users[*].&#123;id,name&#125;"
				class="toolbar-input"
			/>
			{#if filterQuery}
				<button onclick={() => setFilterQuery('')} class="clear-btn">
					<X size={16}/>
				</button>
			{/if}
		</div>
	</div>
	<div class="search-bar">
		<Search size={18} class="search-icon"/>
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search keys or values..."
			class="toolbar-input"
		/>
		{#if searchQuery}
			<button onclick={() => setSearchQuery('')} class="clear-btn">
				<X size={16}/>
			</button>
		{/if}
	</div>
</div>

<style>
	.toolbar {
		flex-shrink: 0;
		margin-bottom: var(--size-8);
		display: flex;
		flex-direction: column;
		gap: var(--size-7);

		@media (min-width: 1024px) {
			flex-direction: row;
		}

		.toolbar-left {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 1rem;

			@media (min-width: 768px) {
				flex-direction: row;
			}
		}

		.toolbar-input {
			background: transparent;
			border: none;
			outline: none;
			width: 100%;
			font-size: var(--size-6);
			color: var(--color-text-muted);

			&::placeholder {
				color: var(--color-text-placeholder);
			}
		}
	}

	.path-bar, .filter-bar, .search-bar {
		background-color: var(--bg-card);
		border: 1px solid var(--border-base);
		border-radius: var(--radius-xl);
		padding: var(--size-4) var(--size-7);
		display: flex;
		align-items: center;
		gap: var(--size-5);
		transition: var(--transition-fast);
	}

	.path-bar {
		flex: 1;
		min-height: 48px;

		.path-label {
			color: var(--color-primary-hover);
			flex-shrink: 0;
			font-family: var(--font-mono);
			font-size: var(--size-5);
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.1em;
		}

		.path-content {
			flex: 1;
			font-family: var(--font-mono);
			font-size: var(--size-6);
			color: var(--color-text-muted);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			.placeholder {
				color: var(--color-text-extra-ghost);
			}
		}
	}

	.filter-bar {
		flex: 1;

		&:focus-within {
			box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
		}

		.filter-label {
			color: var(--color-filter);
			flex-shrink: 0;
			font-family: var(--font-mono);
			font-size: var(--size-5);
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.1em;
		}

		.toolbar-input {
			font-family: var(--font-mono);
		}
	}

	.search-bar {
		flex: 1;

		@media (min-width: 1024px) {
			width: 20rem;
			flex: none;
		}

		&:focus-within {
			box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
		}
	}

	.copy-btn, .clear-btn {
		flex-shrink: 0;
		padding: var(--size-3);
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		color: var(--color-text-ghost);
		cursor: pointer;
		transition: color 0.2s, background-color 0.2s;

		&:hover {
			background-color: var(--bg-hover);
			color: var(--color-text-bright);
		}
	}

	.toolbar-input {
		background: transparent;
		border: none;
		outline: none;
		width: 100%;
		font-size: var(--size-6);
		color: var(--color-text-muted);

		&::placeholder {
			color: var(--color-text-placeholder);
		}
	}

	:global(.search-icon) {
		color: var(--color-text-ghost);
		flex-shrink: 0;
	}

	:global(.success-icon) {
		color: var(--color-success);
	}

	.italic {
		font-style: italic;
	}
</style>
