<script lang="ts">
	import type {JsonContextType, JsonValue} from '../lib/types.ts';
	import {getContext} from 'svelte';
	import {ChevronDown, ChevronRight} from 'lucide-svelte';
	import {slide} from 'svelte/transition';
	import HighlightText from './HighlightText.svelte';
	import JsonNode from './JsonNode.svelte';

	interface Props {
		label?: string;
		value: JsonValue;
		depth?: number;
		path: string;
	}

	let {label, value, depth = 0, path}: Props = $props();

	const context = getContext<JsonContextType>('json-context');

	let isExpanded = $state(true);

	const isObject = $derived(value !== null && typeof value === 'object');
	const isArray = $derived(Array.isArray(value));
	const items = $derived(isArray ? (value as JsonValue[]) : []);
	const entries = $derived(isObject && !isArray ? Object.entries(value as Record<string, JsonValue>) : []);
	const isEmpty = $derived(
		isObject &&
		(isArray
			? items.length === 0
			: entries.length === 0)
	);

	const isSelected = $derived(context.selectedPath === path);

	function handleValueClick(e: MouseEvent | KeyboardEvent) {
		if (e instanceof KeyboardEvent && e.key !== 'Enter' && e.key !== ' ') return;
		e.stopPropagation();
		context.setSelectedPath(path);
	}

	function handleToggle(e: MouseEvent | KeyboardEvent) {
		if (e instanceof KeyboardEvent && e.key !== 'Enter' && e.key !== ' ') return;
		if (!isEmpty) isExpanded = !isExpanded;
		handleValueClick(e);
	}
</script>

{#if !isObject}
	<div
		class="node value"
		class:selected={isSelected}
		onclick={handleValueClick}
		onkeydown={handleValueClick}
		role="button"
		tabindex="0"
	>
		{#if label}
			<span class="label">"<HighlightText text={label} query={context.searchQuery}/>":</span>
		{/if}

		{#if value === null}
			<span class="null">null</span>
		{:else}
			{@const valType = typeof value}
			{#if valType === 'boolean'}
				<span class="boolean">{value}</span>
			{:else}
				{@const valStr = value.toString()}
				{#if valType === 'number'}
					<span class="number">
						<HighlightText text={valStr} query={context.searchQuery}/>
					</span>
				{:else if valType === 'string'}
					<span class="string">
						"<HighlightText text={String(value)} query={context.searchQuery}/>"
					</span>
				{/if}
			{/if}
		{/if}
	</div>
{:else}
	<div class="node container">
		<div
			class="node header"
			class:selected={isSelected}
			onclick={handleToggle}
			onkeydown={handleToggle}
			role="button"
			tabindex="0"
		>
			{#if !isEmpty}
				{#if isExpanded}
					<ChevronDown size={14} class="icon"/>
				{:else}
					<ChevronRight size={14} class="icon"/>
				{/if}
			{:else}
				<div class="spacer"></div>
			{/if}

			{#if label}
				<span class="label">"<HighlightText text={label} query={context.searchQuery}/>":</span>
			{/if}

			<span class="brace">
				{isArray ? '[' : '{'}
				{#if !isExpanded && !isEmpty}
					<span class="ellipsis">...</span>
				{/if}
				{#if isEmpty}
					{isArray ? ']' : '}'}
				{/if}
			</span>
		</div>

		{#if isExpanded && !isEmpty}
			<div transition:slide={{ duration: 200 }} class="children">
				{#if isArray}
					{#each items as item, index}
						<JsonNode value={item} depth={depth + 1} path="{path}[{index}]"/>
					{/each}
				{:else}
					{#each entries as [key, val]}
						<JsonNode label={key} value={val} depth={depth + 1} path="{path}.{key}"/>
					{/each}
				{/if}
			</div>
		{/if}

		{#if isExpanded && !isEmpty}
			<div class="brace closing">
				{isArray ? ']' : '}'}
			</div>
		{/if}
	</div>
{/if}

<style>
	.node {
		&.value, &.header {
			display: flex;
			align-items: flex-start;
			padding-block: var(--size-1);
			font-family: var(--font-mono);
			font-size: var(--size-6);
			line-height: 1.25rem;
			cursor: pointer;
			border-radius: var(--radius-sm);
			padding-inline: var(--size-2);
			transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
			transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
			transition-duration: 150ms;

			&:hover {
				background-color: var(--bg-hover);
			}

			&.selected {
				background-color: rgba(59, 130, 246, 0.2);
			}
		}

		&.header {
			align-items: center;
		}

		&.container {
			font-family: var(--font-mono);
			font-size: var(--size-6);
			line-height: 1.25rem;
		}
	}

	:global(.icon) {
		color: var(--color-text-ghost);
		margin-right: var(--size-2);
	}

	.spacer {
		width: 18px;
	}

	.brace {
		color: var(--color-text-dim);
	}

	.closing {
		padding-left: var(--size-2);
		padding-right: var(--size-2);
	}

	.ellipsis {
		color: var(--color-text-ghost);
		margin-left: var(--size-2);
		margin-right: var(--size-2);
	}

	.children {
		margin-left: var(--size-7);
		border-left: 1px solid var(--border-base);
		padding-left: var(--size-7);
	}
</style>
