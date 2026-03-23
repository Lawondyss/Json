<script lang="ts">
	import {Code, Columns, PanelLeft, PanelRight, Trash2} from 'lucide-svelte';

	interface Props {
		viewMode: 'split' | 'input' | 'output';
		onClear: () => void;
		onFormat: () => void;
		setViewMode: (mode: 'split' | 'input' | 'output') => void;
	}

	let {viewMode, onClear, onFormat, setViewMode}: Props = $props();
</script>

<header class="header">
	<div>
		<h1 class="title">
			<Code class="logo-icon" size={32}/>
			Lawondyss JSON Formatter
		</h1>
	</div>
	<div class="header-actions">
		<div class="view-modes lg-only">
			<button
				onclick={() => setViewMode('input')}
				class="icon-btn"
				class:active={viewMode === 'input'}
				title="Focus Input"
			>
				<PanelLeft size={16}/>
			</button>
			<button
				onclick={() => setViewMode('split')}
				class="icon-btn"
				class:active={viewMode === 'split'}
				title="Split View"
			>
				<Columns size={16}/>
			</button>
			<button
				onclick={() => setViewMode('output')}
				class="icon-btn"
				class:active={viewMode === 'output'}
				title="Focus Output"
			>
				<PanelRight size={16}/>
			</button>
		</div>
		<button
			onclick={onClear}
			class="btn secondary"
		>
			<Trash2 size={16}/>
			Clear
		</button>
		<button
			onclick={onFormat}
			class="btn primary"
		>
			Format JSON
		</button>
	</div>
</header>

<style>
	.header {
		flex-shrink: 0;
		margin-bottom: var(--size-7);
		display: flex;
		flex-direction: column;
		gap: var(--size-7);

		@media (min-width: 768px) {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	.title {
		font-size: var(--size-8);
		font-weight: 700;
		letter-spacing: -0.025em;
		color: var(--color-text-bright);
		display: flex;
		align-items: center;
		gap: var(--size-5);
		margin: 0;

		@media (min-width: 768px) {
			font-size: 1.875rem;
		}
	}

	:global(.logo-icon) {
		color: var(--color-primary-hover);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: var(--size-4);
	}

	.view-modes {
		display: flex;
		align-items: center;
		background-color: var(--bg-hover);
		border: 1px solid var(--border-base);
		border-radius: var(--radius-lg);
		padding: var(--size-2);
		margin-right: var(--size-4);

		&.lg-only {
			display: none;

			@media (min-width: 1024px) {
				display: flex;
			}
		}
	}

	.icon-btn {
		padding: var(--size-2) var(--size-4);
		border-radius: var(--radius-md);
		transition: var(--transition-fast);
		color: var(--color-text-ghost);
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;

		&:hover {
			color: var(--color-text-muted);
		}

		&.active {
			background-color: var(--color-primary);
			color: var(--color-text-bright);
			box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		}
	}

	.btn {
		display: flex;
		align-items: center;
		gap: var(--size-4);
		padding: var(--size-4) var(--size-7);
		border-radius: var(--radius-lg);
		font-size: var(--size-6);
		font-weight: 500;
		transition: var(--transition-fast);
		cursor: pointer;
		border: 1px solid transparent;

		&.secondary {
			background-color: var(--bg-hover);
			border-color: var(--border-base);
			color: var(--color-text-base);

			&:hover {
				background-color: var(--bg-active);
			}
		}

		&.primary {
			background-color: var(--color-primary);
			color: var(--color-text-bright);
			box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
			padding-left: var(--size-8);
			padding-right: var(--size-8);

			&:hover {
				background-color: var(--color-primary-hover);
			}
		}
	}
</style>
