<script setup>
const props = defineProps({ disposition: Array, compact: Boolean })

const dispo = props.disposition?.toSorted((a, b) => b.voice - a.voice);
//// grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5
// row-start-1 row-start-2 row-start-3 row-start-4 row-start-5
// col-start-1 col-start-2 col-start-3 col-start-4 col-start-5

function getBgColor(voice, index) {
    if (voice.type === 'comes') {
        return 'bg-orange-400';
    }
    if (voice.type === 'dux') {
        return 'bg-red-400';
    }
    return 'bg-gray-400';
}

function getBorderColor(voice, index) {
    if (voice.type === 'comes') {
        return 'border-orange-400';
    }
    if (voice.type === 'dux') {
        return 'border-red-500';
    }
    return 'border-gray-500';
}
</script>

<template>
    <div class="grid gap-1 text-xs min-w-[200px]" :class="`grid-cols-${disposition?.length}`">
        <div v-for="(voice, index) in disposition" class="text-white px-1 text-center rounded" :class="`row-start-${disposition?.length + 1 - voice.voice} col-start-${index + 1} ${getBgColor(voice, index)} ${getBorderColor(voice, index)} ${!compact ? 'py-2' : ''}`">
            {{ voice.type }} 
        </div>
    </div>
</template>
