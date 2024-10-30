<script setup>
const { data } = await useAsyncData('wtc', () => queryContent('/wtc/').find())

const { t } = useI18n();

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
        key: 'subjectDeg',
        label: t('subjectDeg'),
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
    key: fugue.key,
    bookNr: `${fugue.book}/${fugue.nr}`,
    book: fugue.book,
    nr: fugue.nr,
    bwv: fugue.bwv,
    parts: fugue.parts,
    meter: fugue.meter,
    answer: fugue.answer,
    subjectStartDeg: fugue.subjectStartDeg,
    subjectEndDeg: fugue.subjectEndDeg,
    subjectDeg: `${fugue.subjectStartDeg} – ${fugue.subjectEndDeg}`,
    horizontal: fugue.exposition?.map(a => getVoiceName(a.voice, fugue.parts)).join(', '),
}))
</script>

<template>
    <UContainer>
        <Heading>{{ $t('wtc') }}</Heading>
        <UTable :rows="pieces" :columns="columns" />
    </UContainer>
</template>
