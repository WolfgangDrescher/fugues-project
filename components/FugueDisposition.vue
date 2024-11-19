<script setup>
const props = defineProps({ disposition: Array, compact: Boolean })

const dispo = props.disposition?.toSorted((a, b) => b.voice - a.voice);
// grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8 grid-cols-9 grid-cols-10

const voices = Math.max(0, ...props.disposition?.map(segment => segment.voice).filter(e => !!e));

function getBgColor(segment, index) {
    if (segment.type === 'codetta') {
        return 'bg-blue-400';
    }
    if (segment.type === 'comes') {
        return 'bg-orange-400';
    }
    if (segment.type === 'dux') {
        return 'bg-red-400';
    }
    return 'bg-gray-400';
}

function getBorderColor(segment) {
    if (segment.type === 'codetta') {
        return 'border-blue-500';
    }
    if (segment.type === 'comes') {
        return 'border-orange-500';
    }
    if (segment.type === 'dux') {
        return 'border-red-500';
    }
    return 'border-gray-500';
}

function getClasses(segment) {
    return [
        'rounded text-white border px-1 text-center flex items-center justify-center',
        getBgColor(segment),
        getBorderColor(segment),
        {
            'py-2': !props.compact,
        },
    ];
}
</script>

<template>
    <div class="grid gap-1 text-xs min-w-[350px]" :class="`grid-cols-${disposition?.length}`">
        <div v-for="(segment, segmentIndex) in disposition" class="grid gap-1">
            <template v-if="segment.type === 'codetta'">
                <div :class="getClasses(segment, segmentIndex, voiceIndex)">
                    {{ segment.type }}
                </div>
            </template>
            <template v-else>
                <div v-for="voiceIndex in voices" :class="[...getClasses(segment), {
                    'invisible': voiceIndex !== voices - segment.voice + 1,
                }]">
                    {{ segment.type }}
                </div>
            </template>
        </div>
    </div>
</template>
