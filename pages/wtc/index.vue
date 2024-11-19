<script setup>
const { data } = await useAsyncData('wtc', () => queryContent('/wtc/').find())

const { t } = useI18n();
const localePath = useLocalePath();

const columns = [
    {
        key: 'bwv',
        label: t('bwv'),
    },
    {
        key: 'bookNr',
        label: t('bookNr'),
    },
    {
        key: 'key',
        label: t('key'),
    },
    {
        key: 'meter',
        label: t('meter'),
    },
    {
        key: 'parts',
        label: t('parts'),
    },
    {
        key: 'answer',
        label: t('answer'),
    },
    {
        key: 'horizontal',
        label: t('horizontal'),
    },
    {
        key: 'vertical',
        label: t('vertical'),
    },
    {
        key: 'disposition',
        label: t('disposition'),
    },
    {
        key: 'subjectDeg',
        label: t('subjectDeg'),
    },
    {
        key: 'subject',
        label: t('subject'),
    },
    {
        key: 'majorMinor',
        label: t('majorMinor'),
    },
    {
        key: 'modulatingSubject',
        label: t('modulatingSubject'),
    },
    {
        key: 'category',
        label: t('category'),
    },
    {
        key: 'codetta',
        label: t('codetta'),
    },
];

function getVoiceName(num, voicesCount) {
    return num;
    if (voicesCount === 4) {
        if (num === 1) return t('bass');
        if (num === 2) return t('tenor');
        if (num === 3) return t('alto');
        if (num === 4) return t('soprano');
    }
    if (voicesCount === 3) {
        if (num === 1) return t('lowerVoice');
        if (num === 2) return t('middleVoice');
        if (num === 3) return t('upperVoice');
    }
    if (voicesCount === 2) {
        if (num === 1) return t('lowerVoice');
        if (num === 2) return t('upperVoice');
    }
    return num;
}

const pieces = data.value.map(fugue => ({
    _piece: fugue,
    id: fugue.id,
    key: fugue.key,
    bookNr: `${fugue.book}/${fugue.nr}`,
    book: fugue.book,
    nr: fugue.nr,
    bwv: fugue.bwv,
    parts: fugue.parts,
    meter: fugue.meter,
    answer: fugue.answer,
    category: fugue.category,
    subjectStartDeg: fugue.subjectStartDeg,
    subjectStartKeyDeg: fugue.subjectStartKeyDeg,
    subjectEndDeg: fugue.subjectEndDeg,
    subjectEndKeyDeg: fugue.subjectEndKeyDeg,
    subjectDeg: getSubjectDegString(fugue),
    horizontal: fugue.exposition?.filter(elem => !!elem).map(a => getVoiceName(a.voice, fugue.parts)).join(', '),
    majorMinor: fugue.majorMinor,
    modulatingSubject: fugue.modulatingSubject,
    codetta: fugue.codetta,
}));

const selectedColumns = ref(columns);
const columnsTable = computed(() => columns.filter(column => selectedColumns.value.includes(column)));

const defaultFilters = {
    key: null,
    parts: null,
    answer: null,
    majorMinor: null,
    modulatingSubject: null,
    category: null,
    codetta: null,
};
const filters = reactive({ ...defaultFilters });

const keys = [...new Set(data.value.map(item => item.key))];
const parts = [...new Set(data.value.map(item => item.parts))].sort();
const answers = [...new Set(data.value.map(item => item.answer).filter(a => a))];
const majorMinor = [...new Set(data.value.map(item => item.majorMinor).filter(a => a))];
const categories = [...new Set(data.value.flatMap(item => item.category).filter(a => a))];

const filteredPieces = computed(() => {
    return pieces.filter(item => {
        return (
            (!filters.key || filters.key === item.key)
            && (!filters.parts || filters.parts === item.parts)
            && (!filters.answer || filters.answer === item.answer)
            && (!filters.majorMinor || filters.majorMinor === item.majorMinor)
            && (!filters.modulatingSubject || item.modulatingSubject)
            && (!filters.category || item.category.includes(filters.category))
            && (filters.codetta === null || item.codetta === filters.codetta)
        );
    });
});

function resetFilters() {
    Object.assign(filters, defaultFilters);
}
</script>

<template>
    <UContainer>
        <Heading>{{ $t('wtc') }}</Heading>
        <div class="flex gap-2 items-end">
            <div>
                <UFormGroup :label="$t('key')">
                    <USelectMenu v-model="filters.key" :options="keys" size="xs" class="w-20" />
                </UFormGroup>
            </div>
            <div>
                <UFormGroup :label="$t('parts')">
                    <USelectMenu v-model="filters.parts" :options="parts" size="xs" class="w-20" />
                </UFormGroup>
            </div>
            <div>
                <UFormGroup :label="$t('answer')">
                    <USelectMenu v-model="filters.answer" :options="answers" size="xs" class="w-24" />
                </UFormGroup>
            </div>
            <div>
                <UFormGroup :label="$t('majorMinor')">
                    <USelectMenu v-model="filters.majorMinor" :options="majorMinor" size="xs" class="w-24" />
                </UFormGroup>
            </div>
            <div>
                <UFormGroup :label="$t('modulatingSubject')">
                    <UCheckbox v-model="filters.modulatingSubject" :label="$t('modulatingSubject')" size="xs" class="w-24" />
                </UFormGroup>
            </div>
            <div>
                <UFormGroup :label="$t('categories')">
                    <USelectMenu v-model="filters.category" :options="categories" size="xs" class="w-24" />
                </UFormGroup>
            </div>
            <div>
                <UFormGroup :label="$t('codetta')">
                    <UCheckbox v-model="filters.codetta" :label="$t('codetta')" />
                </UFormGroup>
            </div>
            <div>
                <UButton icon="i-heroicons-funnel" color="gray" size="xs" @click="resetFilters">
                    {{ $t('reset') }}
                </UButton>
            </div>
            <div class="ml-auto flex gap-2">
                <UButton icon="i-heroicons-funnel" color="gray" size="xs" @click="selectedColumns = columns" />
                <USelectMenu v-model="selectedColumns" :options="columns" multiple>
                    <UButton icon="i-heroicons-view-columns" color="gray" size="xs" class="w-48">
                        {{ $t('columns') }}
                    </UButton>
                </USelectMenu>
            </div>
        </div>

        <div class="my-4">
            {{ $t('nCountResults', { n: filteredPieces.length, count: pieces.length }) }}
        </div>

        <UTable :rows="filteredPieces" :columns="columnsTable">
            <template #bwv-data="{ row }">
                <NuxtLink :to="localePath({ name: 'wtc-id', params: { id: row.id } })">{{ row.bwv }}</NuxtLink>
            </template> 
            <template #subject-data="{ row }">
                <div class="max-w-96">
                    <WtcSubjectScore :key="row.id" :piece="row._piece" />
                </div>
            </template>
            <template #subjectDeg-data="{ row }">
                <div class="font-mono text-xs">
                    {{ row.subjectDeg }}
                </div>
            </template>
            <template #vertical-data="{ row }">
                <pre v-text="row._piece.exposition?.toSorted((a, b) => b.voice - a.voice).map(a => a.type.substring(0, 1).toUpperCase()).join('\n')"></pre>
            </template>
            <template #category-data="{ row }">
                <div class="flex gap-1">
                    <UBadge v-for="category in row.category" :label="category" size="xs" />
                </div>
            </template>
            <template #disposition-data="{ row }">
                <FugueDisposition :disposition="row._piece.exposition" compact />
            </template>
        </UTable>
    </UContainer>
</template>
