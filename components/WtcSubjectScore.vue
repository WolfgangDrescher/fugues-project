<script setup>
import { useIntersectionObserver } from '@vueuse/core';

const props = defineProps({ piece: Object });

const target = ref(null)
const data = ref();

const { stop } = useIntersectionObserver(target, async ([{ isIntersecting }], observerElement) => {
    if (isIntersecting) {
        try {
            const response = await $fetch(props.piece.localRawFile, { parseResponse: (txt) => txt });
            const filters = [];
            if (props.piece.exposition?.[0].voice) {
                filters.push(`extract -k ${props.piece.exposition[0].voice}`);
            }
            if (props.piece.subjectEndLineNumber) {
                filters.push(`myank -l 1-${props.piece.subjectEndLineNumber}`);
            } else {
                filters.push(`myank -m 0-4`);
            }
            data.value = `${response}\n${filters.map(filter => `!!!filter: ${filter}`).join('\n')}`;
        } catch (e) {
            data.value = null;
        }
        stop();
    }
});
</script>

<template>
    <div ref="target">
        <VerovioCanvas v-if="data" :data="data" view-mode="horizontal" :page-margin="30" :scale="25" />
        <USkeleton v-else-if="data !== null" class="h-9 min-w-[300px]" />
    </div>
</template>

<style scoped>
:deep(.loading-component-spinner) {
    display: none;
}

:deep(.verovio-canvas-status) {
    padding: 0.5rem;
}

:deep(.loading-component-message) {
    margin: 0;
}
</style>
