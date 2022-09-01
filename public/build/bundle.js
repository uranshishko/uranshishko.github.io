
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    var translations = {
      sv: {
        // About me
        "aboutme.title": "Om mig",
        "aboutme.intro.title": "Vem är jag?",
        "aboutme.intro.description":
          "Jag är en självlärd fullstackutvecklare med över 5 års erfarenhet inom apputveckling för både web- och desktopmiljöer, databashantering, och inom andra tekniker och platformar. Det jag saknar i professionell erfarenhet kompenserar jag med min ambition och starka vilja att lära och utvecklas. <br /><br /> Jag anser mig själv vara en team player och jag är van med att jobba i både mindre och större grupper, men jag har även den disciplinen och organisatoriska förmågan som krävs för att kunna jobba självständigt.",

        // Education
        "education.title": "Mina kompetenser",
        "education.skills.webdev": "Webbtekniker",
        "education.skills.databases": "Databaser",
        "education.skills.programingLanguages": "Programspråk",

        // Portofolio
        "portofolio.title": "Min portfölj",
        "portofolio.work.finax.title": "Finans- och faktureringsapp.",
        "portofolio.work.finax.description":
          "Appen är byggd med Electron.js, Vue.js och NeDB.",

        // Tabs
        "tabs.aboutme": "Om Mig",
        "tabs.education": "Kompetenser",
        "tabs.portofolio": "Portfölj",
      },
      en: {
        // About me
        "aboutme.title": "About me",
        "aboutme.intro.title": "Who am I?",
        "aboutme.intro.description":
          "I am a self-taught full-stack developer with over 5 years of experience in web and desktop application development, database management and other various platforms and technologies. What I lack in professional experience I make up for with an eagerness to learn, and a strong desire to improve. <br /><br /> I consider myself a great team player whether I work in small or large groups, but I also possess the dicipline and organizational skills to work independently.",

        // Education
        "education.title": "Skills",
        "education.skills.webdev": "Web technologies",
        "education.skills.databases": "Databases",
        "education.skills.programingLanguages": "Programing Languages",

        // Portofolio
        "portofolio.title": "Portofolio",
        "portofolio.work.finax.title": "Finance and billing app for desktops",
        "portofolio.work.finax.description":
          "This app is built using Electron.js, Vue.js och NeDB.",

        // Tabs
        "tabs.aboutme": "About me",
        "tabs.education": "Skills",
        "tabs.portofolio": "Portofolio",
      },
    };

    const locale = writable("en");
    const isTranslate = writable(false);

    function translate(locale, key, vars) {
      if (!key) throw new Error("no key provided to $t()");
      if (!locale) throw new Error(`no translation for key "${key}"`);

      let text = translations[locale][key];

      if (!text) throw new Error(`no translation found for ${locale}.${key}`);

      Object.keys(vars).map((k) => {
        const regex = new RegExp(`{{${k}}}`, "g");
        text = text.replace(regex, vars[k]);
      });

      return text;
    }

    const t = derived(
      locale,
      ($locale) =>
        (key, vars = {}) =>
          translate($locale, key, vars)
    );

    /* src\components\Tab.svelte generated by Svelte v3.49.0 */

    const file$b = "src\\components\\Tab.svelte";

    function create_fragment$b(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", button_class_value = "tab " + (/*isActive*/ ctx[1] ? 'active' : '') + " svelte-s91nk9");
    			add_location(button, file$b, 5, 0, 83);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*clickHandler*/ ctx[0])) /*clickHandler*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*isActive*/ 2 && button_class_value !== (button_class_value = "tab " + (/*isActive*/ ctx[1] ? 'active' : '') + " svelte-s91nk9")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab', slots, ['default']);
    	let { clickHandler } = $$props;
    	let { isActive = false } = $$props;
    	const writable_props = ['clickHandler', 'isActive'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('clickHandler' in $$props) $$invalidate(0, clickHandler = $$props.clickHandler);
    		if ('isActive' in $$props) $$invalidate(1, isActive = $$props.isActive);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ clickHandler, isActive });

    	$$self.$inject_state = $$props => {
    		if ('clickHandler' in $$props) $$invalidate(0, clickHandler = $$props.clickHandler);
    		if ('isActive' in $$props) $$invalidate(1, isActive = $$props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [clickHandler, isActive, $$scope, slots];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { clickHandler: 0, isActive: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*clickHandler*/ ctx[0] === undefined && !('clickHandler' in props)) {
    			console.warn("<Tab> was created without expected prop 'clickHandler'");
    		}
    	}

    	get clickHandler() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clickHandler(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isActive() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isActive(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Tabs.svelte generated by Svelte v3.49.0 */
    const file$a = "src\\components\\Tabs.svelte";

    // (28:4) {#if tabs[0][1]}
    function create_if_block_2$2(ctx) {
    	let span;
    	let t_1_value = /*$t*/ ctx[1]("tabs.aboutme") + "";
    	let t_1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t_1 = text(t_1_value);
    			attr_dev(span, "class", "tag svelte-1yzuc1v");
    			add_location(span, file$a, 28, 6, 725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t_1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$t*/ 2 && t_1_value !== (t_1_value = /*$t*/ ctx[1]("tabs.aboutme") + "")) set_data_dev(t_1, t_1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(28:4) {#if tabs[0][1]}",
    		ctx
    	});

    	return block;
    }

    // (23:2) <Tab      clickHandler={tabClickHandler.bind(this, "about me")}      isActive={tabs[0][1]}    >
    function create_default_slot_2(ctx) {
    	let i;
    	let t_1;
    	let if_block_anchor;
    	let if_block = /*tabs*/ ctx[0][0][1] && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			i = element("i");
    			t_1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(i, "class", "fa-solid fa-user-astronaut");
    			add_location(i, file$a, 26, 4, 655);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t_1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*tabs*/ ctx[0][0][1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t_1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(23:2) <Tab      clickHandler={tabClickHandler.bind(this, \\\"about me\\\")}      isActive={tabs[0][1]}    >",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#if tabs[1][1]}
    function create_if_block_1$2(ctx) {
    	let span;
    	let t_1_value = /*$t*/ ctx[1]("tabs.education") + "";
    	let t_1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t_1 = text(t_1_value);
    			attr_dev(span, "class", "tag svelte-1yzuc1v");
    			add_location(span, file$a, 38, 6, 997);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t_1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$t*/ 2 && t_1_value !== (t_1_value = /*$t*/ ctx[1]("tabs.education") + "")) set_data_dev(t_1, t_1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(38:4) {#if tabs[1][1]}",
    		ctx
    	});

    	return block;
    }

    // (33:2) <Tab      clickHandler={tabClickHandler.bind(this, "education")}      isActive={tabs[1][1]}    >
    function create_default_slot_1$1(ctx) {
    	let i;
    	let t_1;
    	let if_block_anchor;
    	let if_block = /*tabs*/ ctx[0][1][1] && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			i = element("i");
    			t_1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(i, "class", "fa-solid fa-graduation-cap");
    			add_location(i, file$a, 36, 4, 927);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t_1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*tabs*/ ctx[0][1][1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t_1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(33:2) <Tab      clickHandler={tabClickHandler.bind(this, \\\"education\\\")}      isActive={tabs[1][1]}    >",
    		ctx
    	});

    	return block;
    }

    // (48:4) {#if tabs[2][1]}
    function create_if_block$6(ctx) {
    	let span;
    	let t_1_value = /*$t*/ ctx[1]("tabs.portofolio") + "";
    	let t_1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t_1 = text(t_1_value);
    			attr_dev(span, "class", "tag svelte-1yzuc1v");
    			add_location(span, file$a, 48, 6, 1267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t_1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$t*/ 2 && t_1_value !== (t_1_value = /*$t*/ ctx[1]("tabs.portofolio") + "")) set_data_dev(t_1, t_1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(48:4) {#if tabs[2][1]}",
    		ctx
    	});

    	return block;
    }

    // (43:2) <Tab      clickHandler={tabClickHandler.bind(this, "portofolio")}      isActive={tabs[2][1]}    >
    function create_default_slot$3(ctx) {
    	let i;
    	let t_1;
    	let if_block_anchor;
    	let if_block = /*tabs*/ ctx[0][2][1] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			i = element("i");
    			t_1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(i, "class", "fa-solid fa-briefcase");
    			add_location(i, file$a, 46, 4, 1202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t_1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*tabs*/ ctx[0][2][1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t_1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(43:2) <Tab      clickHandler={tabClickHandler.bind(this, \\\"portofolio\\\")}      isActive={tabs[2][1]}    >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let tab0;
    	let t0;
    	let span0;
    	let t1;
    	let tab1;
    	let t2;
    	let span1;
    	let t3;
    	let tab2;
    	let current;

    	tab0 = new Tab({
    			props: {
    				clickHandler: /*tabClickHandler*/ ctx[2].bind(this, "about me"),
    				isActive: /*tabs*/ ctx[0][0][1],
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab1 = new Tab({
    			props: {
    				clickHandler: /*tabClickHandler*/ ctx[2].bind(this, "education"),
    				isActive: /*tabs*/ ctx[0][1][1],
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab2 = new Tab({
    			props: {
    				clickHandler: /*tabClickHandler*/ ctx[2].bind(this, "portofolio"),
    				isActive: /*tabs*/ ctx[0][2][1],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tab0.$$.fragment);
    			t0 = space();
    			span0 = element("span");
    			t1 = space();
    			create_component(tab1.$$.fragment);
    			t2 = space();
    			span1 = element("span");
    			t3 = space();
    			create_component(tab2.$$.fragment);
    			attr_dev(span0, "class", "separator svelte-1yzuc1v");
    			add_location(span0, file$a, 31, 2, 795);
    			attr_dev(span1, "class", "separator svelte-1yzuc1v");
    			add_location(span1, file$a, 41, 2, 1069);
    			attr_dev(div, "class", "tabs rounded shadow svelte-1yzuc1v");
    			add_location(div, file$a, 21, 0, 517);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tab0, div, null);
    			append_dev(div, t0);
    			append_dev(div, span0);
    			append_dev(div, t1);
    			mount_component(tab1, div, null);
    			append_dev(div, t2);
    			append_dev(div, span1);
    			append_dev(div, t3);
    			mount_component(tab2, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tab0_changes = {};
    			if (dirty & /*tabs*/ 1) tab0_changes.isActive = /*tabs*/ ctx[0][0][1];

    			if (dirty & /*$$scope, $t, tabs*/ 19) {
    				tab0_changes.$$scope = { dirty, ctx };
    			}

    			tab0.$set(tab0_changes);
    			const tab1_changes = {};
    			if (dirty & /*tabs*/ 1) tab1_changes.isActive = /*tabs*/ ctx[0][1][1];

    			if (dirty & /*$$scope, $t, tabs*/ 19) {
    				tab1_changes.$$scope = { dirty, ctx };
    			}

    			tab1.$set(tab1_changes);
    			const tab2_changes = {};
    			if (dirty & /*tabs*/ 1) tab2_changes.isActive = /*tabs*/ ctx[0][2][1];

    			if (dirty & /*$$scope, $t, tabs*/ 19) {
    				tab2_changes.$$scope = { dirty, ctx };
    			}

    			tab2.$set(tab2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab0.$$.fragment, local);
    			transition_in(tab1.$$.fragment, local);
    			transition_in(tab2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab0.$$.fragment, local);
    			transition_out(tab1.$$.fragment, local);
    			transition_out(tab2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tab0);
    			destroy_component(tab1);
    			destroy_component(tab2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $t;
    	validate_store(t, 't');
    	component_subscribe($$self, t, $$value => $$invalidate(1, $t = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, []);
    	const dispatch = createEventDispatcher();
    	let tabs = [["about me", true], ["education", false], ["portofolio", false]];

    	function tabClickHandler(tabName) {
    		dispatch("tabToggle", tabName);
    		tabs.forEach(tab => tab[1] = false);
    		let tabIndex = tabs.findIndex(tab => tab[0] === tabName);
    		$$invalidate(0, tabs[tabIndex][1] = true, tabs);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		t,
    		Tab,
    		dispatch,
    		tabs,
    		tabClickHandler,
    		$t
    	});

    	$$self.$inject_state = $$props => {
    		if ('tabs' in $$props) $$invalidate(0, tabs = $$props.tabs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tabs, $t, tabClickHandler];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const webDevItems = readable([
      {
        icon: "fa-brands fa-html5",
        text: "HTML",
        level: 5,
      },
      {
        icon: "fa-brands fa-css3-alt",
        text: "CSS",
        level: 4,
      },
      {
        icon: "fa-brands fa-js-square",
        text: "JavaScript",
        level: 5,
      },
      {
        icon: "fa-brands fa-node-js",
        text: "Node.js",
        level: 5,
      },
      {
        icon: "fa-brands fa-react",
        text: "React",
        level: 4,
      },
      {
        icon: "fa-brands fa-vuejs",
        text: "Vue",
        level: 5,
      },
    ]);

    const databaseItems = readable([
      {
        icon: "fa-solid fa-leaf",
        text: "MongoDB",
        level: 5,
      },
      {
        icon: "fa-solid fa-database",
        text: "SQL",
        level: 3,
      },
    ]);

    const programmingLanguagesItems = readable([
      {
        icon: "fa-solid fa-hashtag",
        text: "C#",
        level: 4,
      },
      {
        icon: "fa-brands fa-java",
        text: "Java",
        level: 4,
      },
      {
        icon: "fa-brands fa-rust",
        text: "Rust",
        level: 3,
      },
    ]);

    const socialMediaLinks = readable([
      {
        link: "https://www.github.com/uranshishko",
        desc: "visit github profile",
        icon: "fa-brands fa-github-alt",
      },
      {
        link: "https://www.linkedin.com/in/uranshishko-963299175",
        desc: "visit linkedin profile",
        icon: "fa-brands fa-linkedin-in",
      },
      {
        link: "https://stackoverflow.com/users/14360602/uranshishko",
        desc: "visit stack overflow profile",
        icon: "fa-brands fa-stack-overflow",
      },
      {
        link: "mailto:uraneshishko@gmail.com",
        desc: "send mail",
        icon: "fa-solid fa-at",
      },
    ]);

    const projects = writable([]);

    const populateProjects = async () => {
      const projs = get_store_value(projects);

      if (projs.length > 0) return projs;

      const { set } = projects;

      try {
        let repos = await fetch("https://api.github.com/users/uranshishko/repos");
        repos = await repos.json();

        repos = repos.map(({ name, description, html_url }) => {
          return {
            name,
            description,
            html_url,
          };
        });

        set(repos);

        return repos;
      } catch (e) {}
    };

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src\components\Link.svelte generated by Svelte v3.49.0 */

    const file$9 = "src\\components\\Link.svelte";

    // (17:2) {#if icon}
    function create_if_block$5(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", /*icon*/ ctx[2]);
    			add_location(i, file$9, 17, 4, 294);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icon*/ 4) {
    				attr_dev(i, "class", /*icon*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(17:2) {#if icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let a;
    	let t0;
    	let t1_value = (/*text*/ ctx[3] ? /*text*/ ctx[3] : "") + "";
    	let t1;
    	let a_href_value;
    	let a_alt_value;
    	let a_style_value;
    	let if_block = /*icon*/ ctx[2] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (if_block) if_block.c();
    			t0 = space();
    			t1 = text(t1_value);
    			attr_dev(a, "href", a_href_value = /*href*/ ctx[0] ? /*href*/ ctx[0] : "#");
    			attr_dev(a, "alt", a_alt_value = /*alt*/ ctx[1] ? /*alt*/ ctx[1] : "");
    			attr_dev(a, "style", a_style_value = /*size*/ ctx[4] ? /*fontSize*/ ctx[5] : "");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$9, 10, 0, 166);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if (if_block) if_block.m(a, null);
    			append_dev(a, t0);
    			append_dev(a, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*icon*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(a, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*text*/ 8 && t1_value !== (t1_value = (/*text*/ ctx[3] ? /*text*/ ctx[3] : "") + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*href*/ 1 && a_href_value !== (a_href_value = /*href*/ ctx[0] ? /*href*/ ctx[0] : "#")) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*alt*/ 2 && a_alt_value !== (a_alt_value = /*alt*/ ctx[1] ? /*alt*/ ctx[1] : "")) {
    				attr_dev(a, "alt", a_alt_value);
    			}

    			if (dirty & /*size, fontSize*/ 48 && a_style_value !== (a_style_value = /*size*/ ctx[4] ? /*fontSize*/ ctx[5] : "")) {
    				attr_dev(a, "style", a_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let fontSize;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, []);
    	let { href } = $$props;
    	let { alt } = $$props;
    	let { icon } = $$props;
    	let { text } = $$props;
    	let { size } = $$props;
    	const writable_props = ['href', 'alt', 'icon', 'text', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('alt' in $$props) $$invalidate(1, alt = $$props.alt);
    		if ('icon' in $$props) $$invalidate(2, icon = $$props.icon);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ href, alt, icon, text, size, fontSize });

    	$$self.$inject_state = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('alt' in $$props) $$invalidate(1, alt = $$props.alt);
    		if ('icon' in $$props) $$invalidate(2, icon = $$props.icon);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('size' in $$props) $$invalidate(4, size = $$props.size);
    		if ('fontSize' in $$props) $$invalidate(5, fontSize = $$props.fontSize);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*size*/ 16) {
    			$$invalidate(5, fontSize = `font-size: ${size}px;`);
    		}
    	};

    	return [href, alt, icon, text, size, fontSize];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			href: 0,
    			alt: 1,
    			icon: 2,
    			text: 3,
    			size: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*href*/ ctx[0] === undefined && !('href' in props)) {
    			console.warn("<Link> was created without expected prop 'href'");
    		}

    		if (/*alt*/ ctx[1] === undefined && !('alt' in props)) {
    			console.warn("<Link> was created without expected prop 'alt'");
    		}

    		if (/*icon*/ ctx[2] === undefined && !('icon' in props)) {
    			console.warn("<Link> was created without expected prop 'icon'");
    		}

    		if (/*text*/ ctx[3] === undefined && !('text' in props)) {
    			console.warn("<Link> was created without expected prop 'text'");
    		}

    		if (/*size*/ ctx[4] === undefined && !('size' in props)) {
    			console.warn("<Link> was created without expected prop 'size'");
    		}
    	}

    	get href() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\BaseLayout.svelte generated by Svelte v3.49.0 */
    const file$8 = "src\\components\\BaseLayout.svelte";

    function create_fragment$8(ctx) {
    	let title_value;
    	let t0;
    	let div4;
    	let div2;
    	let span0;
    	let b;
    	let t1;
    	let t2;
    	let span2;
    	let link;
    	let t3;
    	let span1;
    	let t5;
    	let label;
    	let input;
    	let t6;
    	let div1;
    	let div0;
    	let div1_class_value;
    	let t7;
    	let i;
    	let t8;
    	let div3;
    	let div3_intro;
    	let current;
    	let mounted;
    	let dispose;
    	document.title = title_value = "Uran Shishko • " + /*title*/ ctx[0];

    	link = new Link({
    			props: {
    				href: "https://github.com/uranshishko/uranshishko.github.io",
    				icon: "fa-brands fa-github",
    				alt: "portofolio githup repo",
    				size: 20
    			},
    			$$inline: true
    		});

    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			t0 = space();
    			div4 = element("div");
    			div2 = element("div");
    			span0 = element("span");
    			b = element("b");
    			t1 = text(/*title*/ ctx[0]);
    			t2 = space();
    			span2 = element("span");
    			create_component(link.$$.fragment);
    			t3 = space();
    			span1 = element("span");
    			span1.textContent = "• •";
    			t5 = space();
    			label = element("label");
    			input = element("input");
    			t6 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t7 = space();
    			i = element("i");
    			t8 = space();
    			div3 = element("div");
    			if (default_slot) default_slot.c();
    			add_location(b, file$8, 17, 10, 402);
    			add_location(span0, file$8, 17, 4, 396);
    			add_location(span1, file$8, 25, 6, 642);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "toggle");
    			attr_dev(input, "class", "svelte-1wjak8v");
    			add_location(input, file$8, 27, 8, 697);
    			attr_dev(div0, "class", "toggler svelte-1wjak8v");
    			add_location(div0, file$8, 29, 10, 831);
    			attr_dev(div1, "class", div1_class_value = "toggle " + (/*$isTranslate*/ ctx[1] ? 'on' : '') + " svelte-1wjak8v");
    			add_location(div1, file$8, 28, 8, 772);
    			attr_dev(label, "for", "toggle");
    			add_location(label, file$8, 26, 6, 667);
    			attr_dev(i, "class", "fa-solid fa-language");
    			add_location(i, file$8, 32, 6, 894);
    			attr_dev(span2, "class", "tools svelte-1wjak8v");
    			add_location(span2, file$8, 18, 4, 429);
    			attr_dev(div2, "class", "tool_bar shadow rounded svelte-1wjak8v");
    			add_location(div2, file$8, 16, 2, 353);
    			attr_dev(div3, "class", "content shadow rounded svelte-1wjak8v");
    			add_location(div3, file$8, 35, 2, 955);
    			attr_dev(div4, "class", "base_layout svelte-1wjak8v");
    			add_location(div4, file$8, 15, 0, 324);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, span0);
    			append_dev(span0, b);
    			append_dev(b, t1);
    			append_dev(div2, t2);
    			append_dev(div2, span2);
    			mount_component(link, span2, null);
    			append_dev(span2, t3);
    			append_dev(span2, span1);
    			append_dev(span2, t5);
    			append_dev(span2, label);
    			append_dev(label, input);
    			input.checked = /*$isTranslate*/ ctx[1];
    			append_dev(label, t6);
    			append_dev(label, div1);
    			append_dev(div1, div0);
    			append_dev(span2, t7);
    			append_dev(span2, i);
    			append_dev(div4, t8);
    			append_dev(div4, div3);

    			if (default_slot) {
    				default_slot.m(div3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*title*/ 1) && title_value !== (title_value = "Uran Shishko • " + /*title*/ ctx[0])) {
    				document.title = title_value;
    			}

    			if (!current || dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);

    			if (dirty & /*$isTranslate*/ 2) {
    				input.checked = /*$isTranslate*/ ctx[1];
    			}

    			if (!current || dirty & /*$isTranslate*/ 2 && div1_class_value !== (div1_class_value = "toggle " + (/*$isTranslate*/ ctx[1] ? 'on' : '') + " svelte-1wjak8v")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(default_slot, local);

    			if (!div3_intro) {
    				add_render_callback(() => {
    					div3_intro = create_in_transition(div3, fade, {});
    					div3_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div4);
    			destroy_component(link);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $isTranslate;
    	validate_store(isTranslate, 'isTranslate');
    	component_subscribe($$self, isTranslate, $$value => $$invalidate(1, $isTranslate = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BaseLayout', slots, ['default']);
    	let { title = "Title" } = $$props;
    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BaseLayout> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		$isTranslate = this.checked;
    		isTranslate.set($isTranslate);
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		locale,
    		isTranslate,
    		Link,
    		title,
    		$isTranslate
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$isTranslate*/ 2) {
    			$isTranslate ? locale.set("en") : locale.set("sv");
    		}
    	};

    	return [title, $isTranslate, $$scope, slots, input_change_handler];
    }

    class BaseLayout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BaseLayout",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get title() {
    		throw new Error("<BaseLayout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<BaseLayout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\views\AboutMe.svelte generated by Svelte v3.49.0 */
    const file$7 = "src\\views\\AboutMe.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (52:12) {#each $socialMediaLinks as item, i (i)}
    function create_each_block$3(key_1, ctx) {
    	let a;
    	let i_1;
    	let i_1_class_value;
    	let t_1;
    	let a_href_value;
    	let a_alt_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			a = element("a");
    			i_1 = element("i");
    			t_1 = space();
    			attr_dev(i_1, "class", i_1_class_value = "" + (null_to_empty(/*item*/ ctx[5].icon) + " svelte-1y0h5h9"));
    			add_location(i_1, file$7, 53, 16, 1498);
    			attr_dev(a, "href", a_href_value = /*item*/ ctx[5].link);
    			attr_dev(a, "alt", a_alt_value = /*item*/ ctx[5].desc);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$7, 52, 14, 1428);
    			this.first = a;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i_1);
    			append_dev(a, t_1);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$socialMediaLinks*/ 8 && i_1_class_value !== (i_1_class_value = "" + (null_to_empty(/*item*/ ctx[5].icon) + " svelte-1y0h5h9"))) {
    				attr_dev(i_1, "class", i_1_class_value);
    			}

    			if (dirty & /*$socialMediaLinks*/ 8 && a_href_value !== (a_href_value = /*item*/ ctx[5].link)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*$socialMediaLinks*/ 8 && a_alt_value !== (a_alt_value = /*item*/ ctx[5].desc)) {
    				attr_dev(a, "alt", a_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(52:12) {#each $socialMediaLinks as item, i (i)}",
    		ctx
    	});

    	return block;
    }

    // (21:0) <BaseLayout title={$t("aboutme.title")}>
    function create_default_slot$2(ctx) {
    	let div6;
    	let div0;
    	let section;
    	let p0;
    	let i;
    	let t0_value = /*$t*/ ctx[1]("aboutme.intro.title") + "";
    	let t0;
    	let t1;
    	let p1;
    	let raw_value = /*$t*/ ctx[1]("aboutme.intro.description") + "";
    	let t2;
    	let img0;
    	let img0_src_value;
    	let div0_class_value;
    	let t3;
    	let div5;
    	let div4;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let div3;
    	let h2;
    	let t6;
    	let div2;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let mounted;
    	let dispose;
    	let each_value = /*$socialMediaLinks*/ ctx[3];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[7];
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div0 = element("div");
    			section = element("section");
    			p0 = element("p");
    			i = element("i");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = space();
    			img0 = element("img");
    			t3 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			img1 = element("img");
    			t4 = space();
    			div3 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Uran Shishko";
    			t6 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(i, file$7, 28, 10, 648);
    			set_style(p0, "text-shadow", "1px 1px #111");
    			add_location(p0, file$7, 27, 8, 599);
    			set_style(p1, "text-align", "justify");
    			set_style(p1, "text-justify", "inter-word");
    			set_style(p1, "hyphens", "auto");
    			set_style(p1, "text-shadow", "1px 1px #111");
    			add_location(p1, file$7, 30, 8, 706);
    			attr_dev(section, "lang", /*$locale*/ ctx[2]);
    			add_location(section, file$7, 26, 6, 565);
    			if (!src_url_equal(img0.src, img0_src_value = "./assets/coder.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "coder illustration");
    			attr_dev(img0, "width", "100%");
    			add_location(img0, file$7, 36, 6, 917);
    			attr_dev(div0, "class", div0_class_value = "content_info details rounded " + (/*shadow*/ ctx[0] ? 'details_shadow' : '') + " svelte-1y0h5h9");
    			add_location(div0, file$7, 22, 4, 436);
    			attr_dev(img1, "width", "80%");
    			attr_dev(img1, "loading", "lazy");
    			if (!src_url_equal(img1.src, img1_src_value = "./assets/pic.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "profile_picture");
    			attr_dev(img1, "class", "svelte-1y0h5h9");
    			add_location(img1, file$7, 41, 10, 1101);
    			attr_dev(div1, "class", "frame svelte-1y0h5h9");
    			add_location(div1, file$7, 40, 8, 1070);
    			attr_dev(h2, "class", "svelte-1y0h5h9");
    			add_location(h2, file$7, 49, 10, 1299);
    			attr_dev(div2, "class", "social_media svelte-1y0h5h9");
    			add_location(div2, file$7, 50, 10, 1332);
    			attr_dev(div3, "class", "info svelte-1y0h5h9");
    			add_location(div3, file$7, 48, 8, 1269);
    			attr_dev(div4, "class", "svelte-1y0h5h9");
    			add_location(div4, file$7, 39, 6, 1055);
    			attr_dev(div5, "class", "content_info general rounded svelte-1y0h5h9");
    			add_location(div5, file$7, 38, 4, 1005);
    			attr_dev(div6, "class", "content svelte-1y0h5h9");
    			add_location(div6, file$7, 21, 2, 409);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			append_dev(div0, section);
    			append_dev(section, p0);
    			append_dev(p0, i);
    			append_dev(i, t0);
    			append_dev(section, t1);
    			append_dev(section, p1);
    			p1.innerHTML = raw_value;
    			append_dev(div0, t2);
    			append_dev(div0, img0);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, img1);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, h2);
    			append_dev(div3, t6);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(div0, "scroll", /*scrollHandler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$t*/ 2 && t0_value !== (t0_value = /*$t*/ ctx[1]("aboutme.intro.title") + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$t*/ 2 && raw_value !== (raw_value = /*$t*/ ctx[1]("aboutme.intro.description") + "")) p1.innerHTML = raw_value;
    			if (dirty & /*$locale*/ 4) {
    				attr_dev(section, "lang", /*$locale*/ ctx[2]);
    			}

    			if (dirty & /*shadow*/ 1 && div0_class_value !== (div0_class_value = "content_info details rounded " + (/*shadow*/ ctx[0] ? 'details_shadow' : '') + " svelte-1y0h5h9")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*$socialMediaLinks*/ 8) {
    				each_value = /*$socialMediaLinks*/ ctx[3];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div2, destroy_block, create_each_block$3, null, get_each_context$3);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(21:0) <BaseLayout title={$t(\\\"aboutme.title\\\")}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let baselayout;
    	let current;

    	baselayout = new BaseLayout({
    			props: {
    				title: /*$t*/ ctx[1]("aboutme.title"),
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(baselayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(baselayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const baselayout_changes = {};
    			if (dirty & /*$t*/ 2) baselayout_changes.title = /*$t*/ ctx[1]("aboutme.title");

    			if (dirty & /*$$scope, $socialMediaLinks, shadow, $locale, $t*/ 271) {
    				baselayout_changes.$$scope = { dirty, ctx };
    			}

    			baselayout.$set(baselayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(baselayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(baselayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(baselayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $t;
    	let $locale;
    	let $socialMediaLinks;
    	validate_store(t, 't');
    	component_subscribe($$self, t, $$value => $$invalidate(1, $t = $$value));
    	validate_store(locale, 'locale');
    	component_subscribe($$self, locale, $$value => $$invalidate(2, $locale = $$value));
    	validate_store(socialMediaLinks, 'socialMediaLinks');
    	component_subscribe($$self, socialMediaLinks, $$value => $$invalidate(3, $socialMediaLinks = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AboutMe', slots, []);

    	function scrollHandler(e) {
    		let { scrollTop } = e.target;

    		if (!scrollTop) {
    			$$invalidate(0, shadow = false);
    			return;
    		}

    		$$invalidate(0, shadow = true);
    	}

    	let shadow = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AboutMe> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		t,
    		locale,
    		socialMediaLinks,
    		BaseLayout,
    		scrollHandler,
    		shadow,
    		$t,
    		$locale,
    		$socialMediaLinks
    	});

    	$$self.$inject_state = $$props => {
    		if ('shadow' in $$props) $$invalidate(0, shadow = $$props.shadow);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [shadow, $t, $locale, $socialMediaLinks, scrollHandler];
    }

    class AboutMe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AboutMe",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\Rater.svelte generated by Svelte v3.49.0 */

    const file$6 = "src\\components\\Rater.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (7:2) {#each Array(max) as _, i (i)}
    function create_each_block$2(key_1, ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "dot " + (/*i*/ ctx[4] + 1 <= /*level*/ ctx[0] ? 'active' : '') + " svelte-1aoutu1");
    			add_location(div, file$6, 7, 4, 130);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*max, level*/ 3 && div_class_value !== (div_class_value = "dot " + (/*i*/ ctx[4] + 1 <= /*level*/ ctx[0] ? 'active' : '') + " svelte-1aoutu1")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(7:2) {#each Array(max) as _, i (i)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = Array(/*max*/ ctx[1]);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[4];
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "rater svelte-1aoutu1");
    			add_location(div, file$6, 5, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Array, max, level*/ 3) {
    				each_value = Array(/*max*/ ctx[1]);
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$2, null, get_each_context$2);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Rater', slots, []);
    	let { level = 0 } = $$props;
    	let { max = 5 } = $$props;
    	const writable_props = ['level', 'max'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Rater> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('level' in $$props) $$invalidate(0, level = $$props.level);
    		if ('max' in $$props) $$invalidate(1, max = $$props.max);
    	};

    	$$self.$capture_state = () => ({ level, max });

    	$$self.$inject_state = $$props => {
    		if ('level' in $$props) $$invalidate(0, level = $$props.level);
    		if ('max' in $$props) $$invalidate(1, max = $$props.max);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [level, max];
    }

    class Rater extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { level: 0, max: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Rater",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get level() {
    		throw new Error("<Rater>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set level(value) {
    		throw new Error("<Rater>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Rater>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Rater>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Dropdown.svelte generated by Svelte v3.49.0 */
    const file$5 = "src\\components\\Dropdown.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (14:12) {#if item.icon}
    function create_if_block$4(ctx) {
    	let i;
    	let i_class_value;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" ");
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*item*/ ctx[2].icon) + " svelte-6gqr59"));
    			add_location(i, file$5, 14, 14, 345);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 2 && i_class_value !== (i_class_value = "" + (null_to_empty(/*item*/ ctx[2].icon) + " svelte-6gqr59"))) {
    				attr_dev(i, "class", i_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(14:12) {#if item.icon}",
    		ctx
    	});

    	return block;
    }

    // (11:6) {#each items as item, i (i)}
    function create_each_block$1(key_1, ctx) {
    	let li;
    	let span;
    	let t0;
    	let t1_value = /*item*/ ctx[2].text + "";
    	let t1;
    	let t2;
    	let rater;
    	let t3;
    	let current;
    	let if_block = /*item*/ ctx[2].icon && create_if_block$4(ctx);

    	rater = new Rater({
    			props: { level: /*item*/ ctx[2].level },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			if (if_block) if_block.c();
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			create_component(rater.$$.fragment);
    			t3 = space();
    			attr_dev(span, "class", "svelte-6gqr59");
    			add_location(span, file$5, 12, 10, 294);
    			attr_dev(li, "class", "svelte-6gqr59");
    			add_location(li, file$5, 11, 8, 278);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			if (if_block) if_block.m(span, null);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(li, t2);
    			mount_component(rater, li, null);
    			append_dev(li, t3);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*item*/ ctx[2].icon) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(span, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if ((!current || dirty & /*items*/ 2) && t1_value !== (t1_value = /*item*/ ctx[2].text + "")) set_data_dev(t1, t1_value);
    			const rater_changes = {};
    			if (dirty & /*items*/ 2) rater_changes.level = /*item*/ ctx[2].level;
    			rater.$set(rater_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rater.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rater.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			destroy_component(rater);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(11:6) {#each items as item, i (i)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let details;
    	let summary;
    	let t0;
    	let t1;
    	let div;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[4];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			details = element("details");
    			summary = element("summary");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(summary, "class", "svelte-6gqr59");
    			add_location(summary, file$5, 7, 2, 171);
    			attr_dev(ul, "class", "svelte-6gqr59");
    			add_location(ul, file$5, 9, 4, 228);
    			attr_dev(div, "class", "rounded svelte-6gqr59");
    			add_location(div, file$5, 8, 2, 201);
    			attr_dev(details, "class", "web_dev_details rounded shadow svelte-6gqr59");
    			add_location(details, file$5, 6, 0, 119);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, details, anchor);
    			append_dev(details, summary);
    			append_dev(summary, t0);
    			append_dev(details, t1);
    			append_dev(details, div);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (dirty & /*items*/ 2) {
    				each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(details);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropdown', slots, []);
    	let { title = "TITLE" } = $$props;
    	let { items = [] } = $$props;
    	const writable_props = ['title', 'items'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dropdown> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    	};

    	$$self.$capture_state = () => ({ Rater, title, items });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, items];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { title: 0, items: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get title() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\views\Education.svelte generated by Svelte v3.49.0 */
    const file$4 = "src\\views\\Education.svelte";

    // (13:0) <BaseLayout title={$t("education.title")}>
    function create_default_slot$1(ctx) {
    	let div;
    	let dropdown0;
    	let t0;
    	let hr0;
    	let t1;
    	let dropdown1;
    	let t2;
    	let hr1;
    	let t3;
    	let dropdown2;
    	let t4;
    	let hr2;
    	let current;

    	dropdown0 = new Dropdown({
    			props: {
    				title: /*$t*/ ctx[0]("education.skills.webdev"),
    				items: /*$webDevItems*/ ctx[1]
    			},
    			$$inline: true
    		});

    	dropdown1 = new Dropdown({
    			props: {
    				title: /*$t*/ ctx[0]("education.skills.databases"),
    				items: /*$databaseItems*/ ctx[2]
    			},
    			$$inline: true
    		});

    	dropdown2 = new Dropdown({
    			props: {
    				title: /*$t*/ ctx[0]("education.skills.programingLanguages"),
    				items: /*$programmingLanguagesItems*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(dropdown0.$$.fragment);
    			t0 = space();
    			hr0 = element("hr");
    			t1 = space();
    			create_component(dropdown1.$$.fragment);
    			t2 = space();
    			hr1 = element("hr");
    			t3 = space();
    			create_component(dropdown2.$$.fragment);
    			t4 = space();
    			hr2 = element("hr");
    			attr_dev(hr0, "class", "svelte-1wi0p40");
    			add_location(hr0, file$4, 15, 4, 414);
    			attr_dev(hr1, "class", "svelte-1wi0p40");
    			add_location(hr1, file$4, 17, 4, 508);
    			attr_dev(hr2, "class", "svelte-1wi0p40");
    			add_location(hr2, file$4, 22, 4, 643);
    			attr_dev(div, "class", "svelte-1wi0p40");
    			add_location(div, file$4, 13, 2, 326);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(dropdown0, div, null);
    			append_dev(div, t0);
    			append_dev(div, hr0);
    			append_dev(div, t1);
    			mount_component(dropdown1, div, null);
    			append_dev(div, t2);
    			append_dev(div, hr1);
    			append_dev(div, t3);
    			mount_component(dropdown2, div, null);
    			append_dev(div, t4);
    			append_dev(div, hr2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown0_changes = {};
    			if (dirty & /*$t*/ 1) dropdown0_changes.title = /*$t*/ ctx[0]("education.skills.webdev");
    			if (dirty & /*$webDevItems*/ 2) dropdown0_changes.items = /*$webDevItems*/ ctx[1];
    			dropdown0.$set(dropdown0_changes);
    			const dropdown1_changes = {};
    			if (dirty & /*$t*/ 1) dropdown1_changes.title = /*$t*/ ctx[0]("education.skills.databases");
    			if (dirty & /*$databaseItems*/ 4) dropdown1_changes.items = /*$databaseItems*/ ctx[2];
    			dropdown1.$set(dropdown1_changes);
    			const dropdown2_changes = {};
    			if (dirty & /*$t*/ 1) dropdown2_changes.title = /*$t*/ ctx[0]("education.skills.programingLanguages");
    			if (dirty & /*$programmingLanguagesItems*/ 8) dropdown2_changes.items = /*$programmingLanguagesItems*/ ctx[3];
    			dropdown2.$set(dropdown2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown0.$$.fragment, local);
    			transition_in(dropdown1.$$.fragment, local);
    			transition_in(dropdown2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown0.$$.fragment, local);
    			transition_out(dropdown1.$$.fragment, local);
    			transition_out(dropdown2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(dropdown0);
    			destroy_component(dropdown1);
    			destroy_component(dropdown2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(13:0) <BaseLayout title={$t(\\\"education.title\\\")}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let baselayout;
    	let current;

    	baselayout = new BaseLayout({
    			props: {
    				title: /*$t*/ ctx[0]("education.title"),
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(baselayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(baselayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const baselayout_changes = {};
    			if (dirty & /*$t*/ 1) baselayout_changes.title = /*$t*/ ctx[0]("education.title");

    			if (dirty & /*$$scope, $t, $programmingLanguagesItems, $databaseItems, $webDevItems*/ 31) {
    				baselayout_changes.$$scope = { dirty, ctx };
    			}

    			baselayout.$set(baselayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(baselayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(baselayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(baselayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $t;
    	let $webDevItems;
    	let $databaseItems;
    	let $programmingLanguagesItems;
    	validate_store(t, 't');
    	component_subscribe($$self, t, $$value => $$invalidate(0, $t = $$value));
    	validate_store(webDevItems, 'webDevItems');
    	component_subscribe($$self, webDevItems, $$value => $$invalidate(1, $webDevItems = $$value));
    	validate_store(databaseItems, 'databaseItems');
    	component_subscribe($$self, databaseItems, $$value => $$invalidate(2, $databaseItems = $$value));
    	validate_store(programmingLanguagesItems, 'programmingLanguagesItems');
    	component_subscribe($$self, programmingLanguagesItems, $$value => $$invalidate(3, $programmingLanguagesItems = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Education', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Education> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		t,
    		databaseItems,
    		webDevItems,
    		programmingLanguagesItems,
    		BaseLayout,
    		Dropdown,
    		$t,
    		$webDevItems,
    		$databaseItems,
    		$programmingLanguagesItems
    	});

    	return [$t, $webDevItems, $databaseItems, $programmingLanguagesItems];
    }

    class Education extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Education",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Card.svelte generated by Svelte v3.49.0 */
    const file$3 = "src\\components\\Card.svelte";

    // (28:6) {#if githubLink}
    function create_if_block_2$1(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				href: /*githubLink*/ ctx[1],
    				alt: "Link to github",
    				icon: "fa-brands fa-github",
    				size: 20
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*githubLink*/ 2) link_changes.href = /*githubLink*/ ctx[1];
    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(28:6) {#if githubLink}",
    		ctx
    	});

    	return block;
    }

    // (36:6) {#if webappLink}
    function create_if_block_1$1(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				href: /*webappLink*/ ctx[2],
    				alt: "Link to web app",
    				icon: "fa-solid fa-arrow-up-right-from-square",
    				size: 20
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*webappLink*/ 4) link_changes.href = /*webappLink*/ ctx[2];
    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(36:6) {#if webappLink}",
    		ctx
    	});

    	return block;
    }

    // (44:6) {#if downloadLink}
    function create_if_block$3(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				href: /*downloadLink*/ ctx[3],
    				alt: "Download link",
    				icon: "fa-solid fa-download",
    				size: 20
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*downloadLink*/ 8) link_changes.href = /*downloadLink*/ ctx[3];
    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(44:6) {#if downloadLink}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div4;
    	let div0;
    	let span;
    	let t0;
    	let div0_class_value;
    	let t1;
    	let div3;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let t4;
    	let div3_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let if_block0 = /*githubLink*/ ctx[1] && create_if_block_2$1(ctx);
    	let if_block1 = /*webappLink*/ ctx[2] && create_if_block_1$1(ctx);
    	let if_block2 = /*downloadLink*/ ctx[3] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t2 = space();
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(span, "class", "rounded svelte-1jxarrz");
    			add_location(span, file$3, 20, 4, 483);
    			attr_dev(div0, "class", div0_class_value = "card_image rounded shadow " + (/*isExpanded*/ ctx[4] ? 'shrink' : '') + " svelte-1jxarrz");
    			attr_dev(div0, "style", /*background*/ ctx[5]);
    			add_location(div0, file$3, 15, 2, 327);
    			attr_dev(div1, "class", "description svelte-1jxarrz");
    			add_location(div1, file$3, 23, 4, 601);
    			attr_dev(div2, "class", "links svelte-1jxarrz");
    			add_location(div2, file$3, 26, 4, 660);
    			attr_dev(div3, "class", div3_class_value = "card_content rounded " + (!/*isExpanded*/ ctx[4] ? 'hide' : '') + " svelte-1jxarrz");
    			add_location(div3, file$3, 22, 2, 533);
    			attr_dev(div4, "class", "card rounded shadow svelte-1jxarrz");
    			add_location(div4, file$3, 14, 0, 290);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, span);
    			append_dev(span, t0);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t3);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t4);
    			if (if_block2) if_block2.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (!current || dirty & /*isExpanded*/ 16 && div0_class_value !== (div0_class_value = "card_image rounded shadow " + (/*isExpanded*/ ctx[4] ? 'shrink' : '') + " svelte-1jxarrz")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*background*/ 32) {
    				attr_dev(div0, "style", /*background*/ ctx[5]);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*githubLink*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*githubLink*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, t3);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*webappLink*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*webappLink*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, t4);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*downloadLink*/ ctx[3]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*downloadLink*/ 8) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*isExpanded*/ 16 && div3_class_value !== (div3_class_value = "card_content rounded " + (!/*isExpanded*/ ctx[4] ? 'hide' : '') + " svelte-1jxarrz")) {
    				attr_dev(div3, "class", div3_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let background;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	let { title = "BLANK" } = $$props;
    	let { cardImage } = $$props;
    	let { githubLink } = $$props;
    	let { webappLink } = $$props;
    	let { downloadLink } = $$props;
    	let isExpanded = false;
    	const writable_props = ['title', 'cardImage', 'githubLink', 'webappLink', 'downloadLink'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(4, isExpanded = !isExpanded);

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('cardImage' in $$props) $$invalidate(6, cardImage = $$props.cardImage);
    		if ('githubLink' in $$props) $$invalidate(1, githubLink = $$props.githubLink);
    		if ('webappLink' in $$props) $$invalidate(2, webappLink = $$props.webappLink);
    		if ('downloadLink' in $$props) $$invalidate(3, downloadLink = $$props.downloadLink);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Link,
    		title,
    		cardImage,
    		githubLink,
    		webappLink,
    		downloadLink,
    		isExpanded,
    		background
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('cardImage' in $$props) $$invalidate(6, cardImage = $$props.cardImage);
    		if ('githubLink' in $$props) $$invalidate(1, githubLink = $$props.githubLink);
    		if ('webappLink' in $$props) $$invalidate(2, webappLink = $$props.webappLink);
    		if ('downloadLink' in $$props) $$invalidate(3, downloadLink = $$props.downloadLink);
    		if ('isExpanded' in $$props) $$invalidate(4, isExpanded = $$props.isExpanded);
    		if ('background' in $$props) $$invalidate(5, background = $$props.background);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*cardImage*/ 64) {
    			$$invalidate(5, background = `background: ${cardImage || "#54bdb4"};`);
    		}
    	};

    	return [
    		title,
    		githubLink,
    		webappLink,
    		downloadLink,
    		isExpanded,
    		background,
    		cardImage,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			title: 0,
    			cardImage: 6,
    			githubLink: 1,
    			webappLink: 2,
    			downloadLink: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*cardImage*/ ctx[6] === undefined && !('cardImage' in props)) {
    			console.warn("<Card> was created without expected prop 'cardImage'");
    		}

    		if (/*githubLink*/ ctx[1] === undefined && !('githubLink' in props)) {
    			console.warn("<Card> was created without expected prop 'githubLink'");
    		}

    		if (/*webappLink*/ ctx[2] === undefined && !('webappLink' in props)) {
    			console.warn("<Card> was created without expected prop 'webappLink'");
    		}

    		if (/*downloadLink*/ ctx[3] === undefined && !('downloadLink' in props)) {
    			console.warn("<Card> was created without expected prop 'downloadLink'");
    		}
    	}

    	get title() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cardImage() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cardImage(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get githubLink() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set githubLink(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get webappLink() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set webappLink(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get downloadLink() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set downloadLink(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\views\Portofolio.svelte generated by Svelte v3.49.0 */
    const file$2 = "src\\views\\Portofolio.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>    import { t }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>    import { t }",
    		ctx
    	});

    	return block;
    }

    // (18:2) {:then repos}
    function create_then_block(ctx) {
    	let div;
    	let current;
    	let each_value = /*repos*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "cards svelte-1l098ub");
    			add_location(div, file$2, 18, 4, 503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*populateProjects, colors, randomNum*/ 6) {
    				each_value = /*repos*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(18:2) {:then repos}",
    		ctx
    	});

    	return block;
    }

    // (21:8) {#if repo.name !== "uranshishko" && repo.name !== "HA_Fetcher" && repo.name !== "uranshishko.github.io"}
    function create_if_block$2(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				title: /*repo*/ ctx[4].name.toUpperCase(),
    				cardImage: /*colors*/ ctx[1][/*randomNum*/ ctx[2]()],
    				githubLink: /*repo*/ ctx[4].html_url,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(21:8) {#if repo.name !== \\\"uranshishko\\\" && repo.name !== \\\"HA_Fetcher\\\" && repo.name !== \\\"uranshishko.github.io\\\"}",
    		ctx
    	});

    	return block;
    }

    // (22:10) <Card              title={repo.name.toUpperCase()}              cardImage={colors[randomNum()]}              githubLink={repo.html_url}            >
    function create_default_slot_1(ctx) {
    	let b;
    	let t0_value = /*repo*/ ctx[4].name.toUpperCase() + "";
    	let t0;
    	let br;
    	let t1_value = /*repo*/ ctx[4].description + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			b = element("b");
    			t0 = text(t0_value);
    			br = element("br");
    			t1 = text(t1_value);
    			t2 = space();
    			add_location(b, file$2, 26, 12, 839);
    			add_location(br, file$2, 26, 44, 871);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, b, anchor);
    			append_dev(b, t0);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(b);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(22:10) <Card              title={repo.name.toUpperCase()}              cardImage={colors[randomNum()]}              githubLink={repo.html_url}            >",
    		ctx
    	});

    	return block;
    }

    // (20:6) {#each repos as repo}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*repo*/ ctx[4].name !== "uranshishko" && /*repo*/ ctx[4].name !== "HA_Fetcher" && /*repo*/ ctx[4].name !== "uranshishko.github.io" && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*repo*/ ctx[4].name !== "uranshishko" && /*repo*/ ctx[4].name !== "HA_Fetcher" && /*repo*/ ctx[4].name !== "uranshishko.github.io") if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(20:6) {#each repos as repo}",
    		ctx
    	});

    	return block;
    }

    // (14:29)       <div class="load_screen">        <div class="load_spinner" />      </div>    {:then repos}
    function create_pending_block(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "load_spinner svelte-1l098ub");
    			add_location(div0, file$2, 15, 6, 440);
    			attr_dev(div1, "class", "load_screen svelte-1l098ub");
    			add_location(div1, file$2, 14, 4, 407);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(14:29)       <div class=\\\"load_screen\\\">        <div class=\\\"load_spinner\\\" />      </div>    {:then repos}",
    		ctx
    	});

    	return block;
    }

    // (13:0) <BaseLayout title={$t("portofolio.title")}>
    function create_default_slot(ctx) {
    	let await_block_anchor;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 3,
    		blocks: [,,,]
    	};

    	handle_promise(populateProjects(), info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(13:0) <BaseLayout title={$t(\\\"portofolio.title\\\")}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let baselayout;
    	let current;

    	baselayout = new BaseLayout({
    			props: {
    				title: /*$t*/ ctx[0]("portofolio.title"),
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(baselayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(baselayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const baselayout_changes = {};
    			if (dirty & /*$t*/ 1) baselayout_changes.title = /*$t*/ ctx[0]("portofolio.title");

    			if (dirty & /*$$scope*/ 128) {
    				baselayout_changes.$$scope = { dirty, ctx };
    			}

    			baselayout.$set(baselayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(baselayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(baselayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(baselayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $t;
    	validate_store(t, 't');
    	component_subscribe($$self, t, $$value => $$invalidate(0, $t = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Portofolio', slots, []);
    	let colors = ["#468189", "#77ACA2", "#9DBEBB"];
    	let randomNum = () => Math.round(Math.random() * 4);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Portofolio> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		t,
    		populateProjects,
    		BaseLayout,
    		Card,
    		colors,
    		randomNum,
    		$t
    	});

    	$$self.$inject_state = $$props => {
    		if ('colors' in $$props) $$invalidate(1, colors = $$props.colors);
    		if ('randomNum' in $$props) $$invalidate(2, randomNum = $$props.randomNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$t, colors, randomNum];
    }

    class Portofolio extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Portofolio",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\Container.svelte generated by Svelte v3.49.0 */
    const file$1 = "src\\components\\Container.svelte";

    // (16:2) {#if currentTab === "about me"}
    function create_if_block_2(ctx) {
    	let aboutme;
    	let current;
    	aboutme = new AboutMe({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(aboutme.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(aboutme, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(aboutme.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(aboutme.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(aboutme, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(16:2) {#if currentTab === \\\"about me\\\"}",
    		ctx
    	});

    	return block;
    }

    // (19:2) {#if currentTab === "education"}
    function create_if_block_1(ctx) {
    	let education;
    	let current;
    	education = new Education({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(education.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(education, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(education.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(education.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(education, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(19:2) {#if currentTab === \\\"education\\\"}",
    		ctx
    	});

    	return block;
    }

    // (22:2) {#if currentTab === "portofolio"}
    function create_if_block$1(ctx) {
    	let portofolio;
    	let current;
    	portofolio = new Portofolio({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(portofolio.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(portofolio, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(portofolio.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(portofolio.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(portofolio, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(22:2) {#if currentTab === \\\"portofolio\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let tabs;
    	let t0;
    	let t1;
    	let t2;
    	let current;
    	tabs = new Tabs({ $$inline: true });
    	tabs.$on("tabToggle", /*switchTab*/ ctx[1]);
    	let if_block0 = /*currentTab*/ ctx[0] === "about me" && create_if_block_2(ctx);
    	let if_block1 = /*currentTab*/ ctx[0] === "education" && create_if_block_1(ctx);
    	let if_block2 = /*currentTab*/ ctx[0] === "portofolio" && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tabs.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div, "class", "container svelte-i5v55e");
    			add_location(div, file$1, 13, 0, 328);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tabs, div, null);
    			append_dev(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t2);
    			if (if_block2) if_block2.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*currentTab*/ ctx[0] === "about me") {
    				if (if_block0) {
    					if (dirty & /*currentTab*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*currentTab*/ ctx[0] === "education") {
    				if (if_block1) {
    					if (dirty & /*currentTab*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*currentTab*/ ctx[0] === "portofolio") {
    				if (if_block2) {
    					if (dirty & /*currentTab*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabs.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabs.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tabs);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Container', slots, []);
    	let currentTab = "about me";

    	function switchTab(tabName) {
    		$$invalidate(0, currentTab = tabName.detail);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Container> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Tabs,
    		AboutMe,
    		Education,
    		Portofolio,
    		currentTab,
    		switchTab
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentTab' in $$props) $$invalidate(0, currentTab = $$props.currentTab);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentTab, switchTab];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1 } = globals;
    const file = "src\\App.svelte";

    // (33:2) {#if !isMobile}
    function create_if_block(ctx) {
    	let div0;
    	let div0_class_value;
    	let t;
    	let div1;
    	let div1_class_value;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", div0_class_value = "mouse_decor_circle " + (/*x*/ ctx[0] === 0 ? 'hide' : '') + " svelte-1lut98w");
    			attr_dev(div0, "style", /*cssPositioning*/ ctx[3]);
    			add_location(div0, file, 33, 4, 653);
    			attr_dev(div1, "class", div1_class_value = "mouse_decor_ball " + (/*x*/ ctx[0] === 0 ? 'hide' : '') + " svelte-1lut98w");
    			attr_dev(div1, "style", /*cssPositioning*/ ctx[3]);
    			add_location(div1, file, 37, 4, 755);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*x*/ 1 && div0_class_value !== (div0_class_value = "mouse_decor_circle " + (/*x*/ ctx[0] === 0 ? 'hide' : '') + " svelte-1lut98w")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*cssPositioning*/ 8) {
    				attr_dev(div0, "style", /*cssPositioning*/ ctx[3]);
    			}

    			if (dirty & /*x*/ 1 && div1_class_value !== (div1_class_value = "mouse_decor_ball " + (/*x*/ ctx[0] === 0 ? 'hide' : '') + " svelte-1lut98w")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*cssPositioning*/ 8) {
    				attr_dev(div1, "style", /*cssPositioning*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(33:2) {#if !isMobile}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let container;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	container = new Container({ $$inline: true });
    	let if_block = !/*isMobile*/ ctx[2] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(container.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(main, "class", "svelte-1lut98w");
    			add_location(main, file, 25, 0, 539);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(container, main, null);
    			append_dev(main, t);
    			if (if_block) if_block.m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(main, "mousemove", /*mousemove_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*isMobile*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(container);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let positioning;
    	let cssPositioning;
    	let isMobile;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	if (isMobile && screen && screen.orientation && screen.orientation.lock) screen.orientation.lock("portrait");
    	let x = 0, y = 0;
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const mousemove_handler = e => {
    		$$invalidate(0, x = e.clientX);
    		$$invalidate(1, y = e.clientY);
    	};

    	$$self.$capture_state = () => ({
    		Container,
    		x,
    		y,
    		isMobile,
    		positioning,
    		cssPositioning
    	});

    	$$self.$inject_state = $$props => {
    		if ('x' in $$props) $$invalidate(0, x = $$props.x);
    		if ('y' in $$props) $$invalidate(1, y = $$props.y);
    		if ('isMobile' in $$props) $$invalidate(2, isMobile = $$props.isMobile);
    		if ('positioning' in $$props) $$invalidate(4, positioning = $$props.positioning);
    		if ('cssPositioning' in $$props) $$invalidate(3, cssPositioning = $$props.cssPositioning);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*y, x*/ 3) {
    			$$invalidate(4, positioning = { top: y + "px", left: x + "px" });
    		}

    		if ($$self.$$.dirty & /*positioning*/ 16) {
    			$$invalidate(3, cssPositioning = Object.entries(positioning).map(([key, value]) => `${key}: ${value}`).join("; ") + ";");
    		}
    	};

    	$$invalidate(2, isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent));
    	return [x, y, isMobile, cssPositioning, positioning, mousemove_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
