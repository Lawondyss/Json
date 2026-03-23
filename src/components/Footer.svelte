<script lang="ts">
</script>

<footer class="footer">
	<div class="legend">
		<span class="legend-item"><span class="dot blue"></span> Keys</span>
		<span class="legend-item"><span class="dot green"></span> Strings</span>
		<span class="legend-item"><span class="dot orange"></span> Numbers</span>
		<span class="legend-item"><span class="dot purple"></span> Booleans</span>
	</div>
</footer>

<style>
	.footer {
		flex-shrink: 0;
		margin-top: var(--size-8);
		padding-top: var(--size-8);
		border-top: 1px solid var(--border-dim);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		gap: var(--size-7);
		font-size: 0.625rem;
		color: var(--color-text-extra-ghost);

		@media (min-width: 768px) {
			flex-direction: row;
			font-size: var(--size-5);
		}
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--size-7);

		@media (min-width: 768px) {
			gap: var(--size-8);
		}

		.legend-item {
			display: flex;
			align-items: center;
			gap: var(--size-3);
		}
	}

	.dot {
		width: var(--size-4);
		height: var(--size-4);
		border-radius: var(--radius-full);

		&.blue {
			background-color: var(--color-key);
		}

		&.green {
			background-color: var(--color-string);
		}

		&.orange {
			background-color: var(--color-number);
		}

		&.purple {
			background-color: var(--color-boolean);
		}
	}
</style>
