<script lang="ts">
	import {setContext} from 'svelte';
	import {AlertCircle, Check, Code, Copy} from 'lucide-svelte';
	import {fade} from 'svelte/transition';
	import JsonNode from './components/JsonNode.svelte';
	import Header from './components/Header.svelte';
	import Toolbar from './components/Toolbar.svelte';
	import Footer from './components/Footer.svelte';
	import {applyFilter} from './lib/json-utils';
	import type {JsonContextType, JsonValue} from './lib/types';

	let input = $state('');
	let parsedJson = $state<JsonValue | null>(null);
	let error = $state<string | null>(null);
	let copied = $state(false);
	let searchQuery = $state('');
	let selectedPath = $state('');
	let filterQuery = $state('');
	let pathCopied = $state(false);
	let viewMode = $state<'split' | 'input' | 'output'>('split');

	const filteredData = $derived.by(() => {
		if (!parsedJson || !filterQuery) return parsedJson;
		try {
			return applyFilter(parsedJson, filterQuery);
		} catch (e) {
			return undefined;
		}
	});

	function handleFormat() {
		if (!input.trim()) {
			parsedJson = null;
			error = null;
			selectedPath = '';
			filterQuery = '';
			viewMode = 'split';
			return;
		}

		try {
			parsedJson = JSON.parse(input);
			error = null;
			selectedPath = 'root';
			filterQuery = '';
			viewMode = 'output';
		} catch (e) {
			error = e instanceof Error ? e.message : 'Invalid JSON';
			parsedJson = null;
			selectedPath = '';
			filterQuery = '';
			viewMode = 'input';
		}
	}

	function handleCopy() {
		const dataToCopy = filteredData !== undefined ? filteredData : parsedJson;
		if (dataToCopy) {
			navigator.clipboard.writeText(JSON.stringify(dataToCopy, null, 2));
			copied = true;
			setTimeout(() => copied = false, 2000);
		}
	}

	function handleCopyPath() {
		if (selectedPath) {
			navigator.clipboard.writeText(selectedPath);
			pathCopied = true;
			setTimeout(() => pathCopied = false, 2000);
		}
	}

	function handleClear() {
		input = '';
		parsedJson = null;
		error = null;
		selectedPath = '';
		filterQuery = '';
		searchQuery = '';
	}

	setContext<JsonContextType>('json-context', {
		get searchQuery() {
			return searchQuery;
		},
		get selectedPath() {
			return selectedPath;
		},
		setSelectedPath: (path: string) => {
			selectedPath = path;
		}
	});
</script>

<div class="app-wrapper">
	<div class="container">
		<Header
			{viewMode}
			onClear={handleClear}
			onFormat={handleFormat}
			setViewMode={(mode) => (viewMode = mode)}
		/>

		<Toolbar
			{selectedPath}
			{pathCopied}
			onCopyPath={handleCopyPath}
			bind:filterQuery
			setFilterQuery={(q) => (filterQuery = q)}
			bind:searchQuery
			setSearchQuery={(q) => (searchQuery = q)}
		/>

		<main class="main-content mode-{viewMode}">
			<!-- Input Section -->
			<div class="section">
				<div class="header">
					<span class="label">Input JSON</span>
				</div>
				<textarea
					bind:value={input}
					placeholder='Paste your JSON here... e.g. &#123;"name": "John", "age": 30&#125;'
					class="editor input-editor"
					aria-label="Input JSON"
				></textarea>
			</div>

			<!-- Output Section -->
			<div class="section">
				<div class="header">
					<span class="label">
						{filterQuery ? 'Filtered Result' : 'Formatted Tree'}
					</span>
					{#if filteredData !== undefined}
						<button
							onclick={handleCopy}
							class="copy-result-btn"
						>
							{#if copied}
								<Check size={14} class="success-icon"/>
							{:else}
								<Copy size={14}/>
							{/if}
							{copied ? 'Copied!' : 'Copy Result'}
						</button>
					{/if}
				</div>
				<div class="editor output-viewer relative" aria-label="JSON Output">
					{#if error}
						<div
							in:fade={{ duration: 200 }}
							class="alert"
						>
							<AlertCircle size={18} class="shrink-0"/>
							<div>
								<p class="alert-title">Invalid JSON</p>
								<p class="alert-desc">{error}</p>
							</div>
						</div>
					{/if}

					{#if !parsedJson && !error}
						<div class="empty-state">
							<div class="icon-wrapper">
								<Code size={32} class="opacity-20"/>
							</div>
							<p class="text">Formatted output will appear here</p>
						</div>
					{/if}

					{#if parsedJson && filteredData === undefined}
						<div class="empty-state">
							<AlertCircle size={32} class="opacity-20"/>
							<p class="text text-center">No data found for the given filter path</p>
						</div>
					{/if}

					{#if parsedJson && filteredData !== undefined}
						<div class="tree-wrapper">
							<JsonNode value={filteredData} path={filterQuery || "root"}/>
						</div>
					{/if}
				</div>
			</div>
		</main>

		<Footer/>
	</div>
</div>

<style>
	.app-wrapper {
		height: 100vh;
		color: var(--color-text-base);
		padding: var(--size-7);
		font-family: var(--font-sans);
		display: flex;
		flex-direction: column;
		overflow: hidden;

		@media (min-width: 768px) {
			padding: var(--size-9);
		}
	}

	.container {
		max-width: 80rem;
		margin-left: auto;
		margin-right: auto;
		width: 100%;
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	.main-content {
		flex: 1;
		min-height: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--size-8);
		overflow: hidden;
		transition: var(--transition-normal);

		@media (min-width: 1024px) {
			&.mode-split {
				grid-template-columns: repeat(2, minmax(0, 1fr));
			}

			&.mode-input {
				grid-template-columns: 1fr 0fr;
				gap: 0;

				.section:last-child {
					display: none;
				}
			}

			&.mode-output {
				grid-template-columns: 0fr 1fr;
				gap: 0;

				.section:first-child {
					display: none;
				}
			}
		}
	}

	.section {
		display: flex;
		flex-direction: column;
		min-height: 0;
		gap: var(--size-4);

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-left: var(--size-4);
			padding-right: var(--size-4);
			flex-shrink: 0;
		}

		.label {
			font-size: var(--size-5);
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			color: var(--color-text-ghost);
		}
	}

	.editor {
		flex: 1;
		background-color: var(--bg-card);
		border: 1px solid var(--border-base);
		border-radius: var(--radius-xl);
		padding: var(--size-7);
		font-family: var(--font-mono);
		font-size: var(--size-6);
		transition: var(--transition-fast);
		overflow: auto;

		&.input-editor {
			resize: none;
			color: var(--color-text-base);
			outline: none;

			&:focus {
				box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
			}

			&::placeholder {
				color: var(--color-text-placeholder);
			}
		}
	}

	.copy-result-btn {
		display: flex;
		align-items: center;
		gap: var(--size-3);
		font-size: var(--size-5);
		font-weight: 500;
		color: var(--color-text-dim);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: color 0.2s;

		&:hover {
			color: var(--color-text-bright);
		}
	}

	.alert {
		display: flex;
		align-items: flex-start;
		gap: var(--size-5);
		padding: var(--size-7);
		border-radius: var(--radius-lg);
		font-size: var(--size-6);
		background-color: rgba(239, 68, 68, 0.1);
		border: 1px solid var(--border-error);
		color: var(--color-error-bright);

		.alert-title {
			font-weight: 600;
			margin: 0;
		}

		.alert-desc {
			opacity: 0.8;
			margin: 0;
		}
	}

	.empty-state {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: var(--color-text-extra-ghost);
		gap: var(--size-7);

		.icon-wrapper {
			width: 4rem;
			height: 4rem;
			border-radius: var(--radius-full);
			background-color: var(--bg-hover);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.text {
			font-size: var(--size-6);
			margin: 0;
		}
	}

	.tree-wrapper {
		animation: fadeIn var(--transition-normal) ease-out;
		min-width: max-content;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.shrink-0 {
		flex-shrink: 0;
	}

	.relative {
		position: relative;
	}

	.text-center {
		text-align: center;
	}

	.opacity-20 {
		opacity: 0.2;
	}
</style>
