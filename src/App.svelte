<script lang="ts">
    import { is, filterProcessor, FilterNoneFound, FilterError } from './lib/utils'

    let inputElm: HTMLTextAreaElement|null = null
    let indentMultiplier = $state<number>(4)
    //let input = $state<string>('[{"id":123,"name":"Alice Smith","isActive":false,"profile":{"age":28,"email":"alice.smith@example.com","phoneNumbers":["555-1234","555-5678"],"address":{"street":"789 Maple St","city":"Home\\"town","state":"CA","zip":"90210"},"preferences":{"newsletter":true,"notifications":{"email":true,"sms":false},"categories":["health","fashion","science","art","history","gaming","finance","education"]}},"roles":["user"],"metadata":{"createdAt":"2022-04-12T07:20:50Z","updatedAt":"2023-03-11T10:05:30Z","lastLogin":"2024-06-22T14:45:00Z","loginHistory":[{"date":"2024-06-22T14:45:00Z","ip":"192.168.1.1"},{"date":"2024-06-21T18:25:00Z","ip":"192.168.1.2"}]},"settings":{"theme":"dark","language":"en-US","privacy":{"profileVisibility":"friends","searchEngineIndexing":false}},"preferences":{"favoriteColors":["blue","green"],"interests":[{"name":"technology","level":"high"},{"name":"sports","level":"medium"}]},"tasks":[{"title":"Finish report","dueDate":"2024-06-25T09:00:00Z","completed":false},{"title":"Call Bob","dueDate":"2024-06-23T15:00:00Z","completed":true},{"title":"Review code","dueDate":null,"completed":null}],"notifications":[{"type":"email","message":"You have a new message from Bob","receivedAt":"2024-06-22T11:20:00Z"},{"type":"sms","message":"Your package has been delivered","receivedAt":"2024-06-21T09:10:00Z"},{"type":"push","message":"Meeting starts in 10 minutes","receivedAt":null}],"stats":{"posts":42,"followers":128,"following":300,"lastPostId":null},"monthlyExpenses":[["January",2000],["February",1800],["March",2200],["April",2100],["May",2300],["June",1900],["July",2400],["August",2000],["September",2100],["October",2200],["November",2300],["December",2500]]},{"id":123,"name":"John Smith","isActive":true,"profile":{"age":28,"email":"john.smith@example.com","phoneNumbers":["555-1234","555-5678"],"address":{"street":"789 Maple St","city":"Hometown","state":"CA","zip":"90210"},"preferences":{"newsletter":true,"notifications":{"email":true,"sms":false},"categories":["technology","sports","music","movies","books","travel","food"]}},"roles":["user","editor"],"metadata":{"createdAt":"2022-04-12T07:20:50Z","updatedAt":"2023-03-11T10:05:30Z","lastLogin":"2024-06-22T14:45:00Z","loginHistory":[{"date":"2024-06-22T14:45:00Z","ip":"192.168.1.1"},{"date":"2024-06-21T18:25:00Z","ip":"192.168.1.2"}]},"settings":{"theme":"dark","language":"en-US","privacy":{"profileVisibility":"friends","searchEngineIndexing":false}},"preferences":{"favoriteColors":["blue","green"],"interests":[{"name":"technology","level":"high"},{"name":"sports","level":"medium"}]},"tasks":[{"title":"Finish report","dueDate":"2024-06-25T09:00:00Z","completed":false},{"title":"Call Bob","dueDate":"2024-06-23T15:00:00Z","completed":true},{"title":"Review code","dueDate":null,"completed":null}],"notifications":[{"type":"email","message":"You have a new message from Bob","receivedAt":"2024-06-22T11:20:00Z"},{"type":"sms","message":"Your package has been delivered","receivedAt":"2024-06-21T09:10:00Z"},{"type":"push","message":"Meeting starts in 10 minutes","receivedAt":null}],"stats":{"posts":42,"followers":128,"following":300,"lastPostId":null},"monthlyExpenses":[["January",2000],["February",1800],["March",2200],["April",2100],["May",2300],["June",1900],["July",2400],["August",2000],["September",2100],["October",2200],["November",2300],["December",2500]]}]')
    let input = $state<string>('')
    let {
        output, error, position
    }: {
        output: string | undefined, error: string | null, position: number | null
    } = $derived.by(() => {
        try {
            const output = input ? JSON.parse(input) : undefined

            return {output, error: null, position: null}

        } catch (err) {
            let error = String(err).replace('SyntaxError: ', '').replace(' is not valid JSON', '').replace(/ \(line[^)]+\)/, '')
            const regex = /(\d+)$/
            const position = parseInt(error.match(regex)?.at(0) ?? '0')

            error = error.replace(regex, '')

            return {output: undefined, error, position}
        }
    })

    let cursor = $state<number|null>(null)
    const refreshCursor = () => cursor = inputElm?.selectionStart ?? null
    const setCursor = () => {
        cursor = position
        inputElm?.setSelectionRange(cursor, cursor)
        inputElm?.focus()
    }

    let filterElm: HTMLInputElement|null = null
    let filter = $state<string>('')
    let filteredOutput = $state<any>(null)
    const applyFilter = () => {
        filteredOutput = filterProcessor.process(filter, output)
    }

    $effect(() => {
        inputElm = document.querySelector('textarea')
        inputElm?.addEventListener('blur', () => cursor = null)
        inputElm?.addEventListener('focus', refreshCursor)
        inputElm?.addEventListener('click', refreshCursor)
        inputElm?.addEventListener('keydown', refreshCursor)
        inputElm?.addEventListener('keyup', refreshCursor)

        filterElm = document.querySelector('#filter')
        filterElm?.addEventListener('change', applyFilter)
    })

    $effect(() => {
        filteredOutput || output // to register events for each output change

        document.querySelectorAll('.toggle')
            .forEach((elm: Element) => {
                elm.addEventListener('click', () => {
                    elm.parentElement?.classList.toggle('close');
                })
            })
    })
</script>

<div id="help" popover="auto">
    <h1>Help</h1>
    <h2>Path</h2>
    <dl>
        <dt class="code">[]</dt><dd>Expects an array and returns all items.</dd>
        <dt class="code">[&lt;index&gt;]</dt><dd>Expects an array and returns the item at the specified <code>&lt;index&gt;</code>.</dd>
        <dt class="code">&lt;property&gt;</dt><dd>Expects an object and returns a <code>&lt;property&gt;</code> of the given name. Nested properties are separated by a dot.</dd>
    </dl>
    <h2>Filter for path</h2>
    <p>Filters values on a given path. If the value is an array, it's applied to each item.</p>
    <dl>
        <dt class="code">&lpar;=&lt;query&gt;&rpar;</dt><dd>Value must match the <code>&lt;query&gt;</code> exactly.</dd>
        <dt class="code">&lpar;^&lt;query&gt;&rpar;</dt><dd>Value must start with a <code>&lt;query&gt;</code>.</dd>
        <dt class="code">&lpar;*&lt;query&gt;&rpar;</dt><dd>Value must contain a <code>&lt;query&gt;</code>.</dd>
        <dt class="code">&lpar;$&lt;query&gt;&rpar;</dt><dd>Value must end with a <code>&lt;query&gt;</code>.</dd>
    </dl>
    <h2>Types of query in filter</h2>
    <dl>
        <dt class="code">string</dt><dd>The value must begin and end with quotation marks or apostrophes.</dd>
        <dt class="code">boolean</dt><dd>The value must be in capital letters.</dd>
        <dt class="code">null</dt><dd>The value must be in capital letters.</dd>
        <dt class="code">number</dt><dd>The value must be an integer or decimal number.</dd>
    </dl>
</div>

{#snippet space(size)}{#each new Array(size * indentMultiplier) as i}&nbsp;{/each}{/snippet}

{#snippet tString(value)}
    <span class="string">"{value.replace('"', '\\"')}"</span>
{/snippet}

{#snippet tNumber(value)}
    <span class="number">{value}</span>
{/snippet}

{#snippet tBoolean(value)}
    <span class="boolean">{value ? 'TRUE' : 'FALSE'}</span>
{/snippet}

{#snippet tNull()}
    <span class="null">NULL</span>
{/snippet}

{#snippet tArray(value: Array<any>, indent: number)}
    <span class="array" class:scalar={is.scalar(value[0])}>&lbrack;<span class="toggle">▼</span>
        {#each value as item, idx}
            {#if is.array(item)}<br>{@render space(indent + 1)}{/if}
            {@render typed(item, indent + 1)}{#if !is.last(value, idx)}<span class="comma">, </span>{/if}
        {/each}
        {#if !is.scalar(value[0])}<span class="last"><br>{@render space(indent)}</span>{/if}&rbrack;
    </span>
{/snippet}

{#snippet tObject(value: object, indent: number = 0)}
    <span class="object" class:close={false}>&lbrace;<span class="toggle">▼</span><br>
        {#each Object.entries(value) as [k, v]}
            <span class="property">
                <span class="key">{@render space(indent + 1)}{k}</span>:
                {@render typed(v, indent + 1)}{#if !is.last(value, k)},{/if}
                <br>
            </span>
        {/each}<span>{@render space(indent)}</span>&rbrace;
    </span>
{/snippet}

{#snippet typed(value: any, indent: number)}
    {#if is.string(value)}{@render tString(value)}
    {:else if is.number(value)}{@render tNumber(value)}
    {:else if is.boolean(value)}{@render tBoolean(value)}
    {:else if is.null(value)}{@render tNull()}
    {:else if is.array(value)}{@render tArray(value, indent)}
    {:else if is.object(value)}{@render tObject(value, indent)}
    {/if}
{/snippet}


<section>
    <header style:border-top-left-radius="var(--radius)">
        <div id="cursor">Cursor position: {cursor ?? 'none'}</div>
    </header>
    <textarea bind:value={input} style:border-bottom-left-radius="var(--radius)"></textarea>
</section>

<section class="flexible">
    <header style:border-top-right-radius="var(--radius)">
        <input id="filter" type="text" bind:value={filter} class:invalid={filteredOutput === FilterError} placeholder="path / filter"/>
        <button popovertarget="help" aria-label="Show help">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM7.92 9.234v.102a.5.5 0 0 0 .5.5h.997a.499.499 0 0 0 .499-.499c0-1.29.998-1.979 2.34-1.979 1.308 0 2.168.689 2.168 1.67 0 .928-.482 1.359-1.686 1.91l-.344.154C11.379 11.54 11 12.21 11 13.381v.119a.5.5 0 0 0 .5.5h.997a.499.499 0 0 0 .499-.499c0-.516.138-.723.55-.912l.345-.155c1.445-.654 2.529-1.514 2.529-3.39v-.103c0-1.978-1.72-3.441-4.164-3.441-2.478 0-4.336 1.428-4.336 3.734zm2.58 7.757c0 .867.659 1.509 1.491 1.509.85 0 1.509-.642 1.509-1.509 0-.867-.659-1.491-1.509-1.491-.832 0-1.491.624-1.491 1.491z"/>
            </svg>
        </button>
    </header>
    <output class="flexible" style="border-bottom-right-radius: var(--radius)">
        {#if error}
            <div class="msg error">
                {error} <button onclick={setCursor}>{position}</button>
            </div>
        {:else if filteredOutput === FilterNoneFound}
            <div class="msg info">
                Filtered output is empty
            </div>
        {:else if (filteredOutput ?? output) !== ''}
            {@render typed(filteredOutput ?? output, 0)}
        {/if}
    </output>
</section>

<style>
    h1 {
        text-align: center;
    }

    dl {
        display: grid;
        align-items: center;
        grid-template-columns: auto 1fr;
        gap: var(--gap-small);
    }

    section {
        display: flex;
        flex-direction: column;
        gap: var(--gap-small);

        &.flexible {
            flex: 1;
            min-width: 0;
            width: 100%;
            overflow: hidden;
        }

        header {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            height: 3rem;
            padding-inline: var(--gap);
            background-color: var(--dark-2);
            overflow: hidden;

            &:has(input.invalid) {
                background-color: var(--danger);
            }

            input {
                align-self: stretch;
                flex: 1;
                font-size: 1rem;
                font-family: var(--font-mono), monospace;
            }

            button {
                aspect-ratio: 1;
                height: 80%;
                padding: var(--gap-small);
                background-color: transparent;
                border: none;

                svg {
                    fill: rgb(from var(--light) r g b / .5);

                    &:hover, &:focus, &:focus-visible {
                        fill: var(--light);
                    }
                }
            }
        }

        textarea {
            flex: 1;
            min-width: max(200px, 20vw);
            width: 40vw;
            max-width: min(calc(100vw - 200px), 75vw);
            resize: horizontal;
            background-color: var(--dark-2);
            padding: var(--gap);
        }

        output {
            flex: 1;
            display: flex;
            padding: var(--gap);
            font-family: var(--font-mono), monospace;
            line-height: 1.2;
            overflow: auto;
            background-color: var(--dark-2);
            min-width: 0;
            width: 100%;

            .msg {
                display: block;
                place-self: center;
                width: max-content;
                margin-inline: auto;
                padding: var(--gap);
                border-radius: var(--radius-small);

                &.info {
                    color: var(--light);
                    background-color: var(--info);
                }

                &.error {
                    color: var(--light);
                    background-color: var(--danger);
                }
            }
        }
    }

    .toggle {
        padding: var(--gap-small);
        cursor: pointer;
    }

    .close {
        & > *:not(.toggle) {
            display: none !important;
        }

        & > .toggle {
            display: inline-block;
            padding-block: 0;
            transform: rotate(-90deg);
        }
    }

    .comma, .last {
        display: inline;
    }

    .string {
        color: var(--string);
        text-wrap: nowrap;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .number {
        color: var(--number);
    }

    .boolean {
        color: var(--boolean);
    }

    .null {
        color: var(--null);
    }

    .array, .object, .property {
        color: var(--symbols);
    }

    .property:has(> .scalar) {
        display: flex;
    }

    .key {
        color: var(--key);
    }
</style>
