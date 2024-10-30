<script setup>
const { t } = useI18n();
const localePath = useLocalePath();

const links = [
    {
        label: t('home'),
        to: localePath({name: 'index'}),
    },
    {
        label: t('wtc'),
        to: localePath({name: 'wtc'}),
    },
];
</script>

<template>
    <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800 px-2" />
</template>
