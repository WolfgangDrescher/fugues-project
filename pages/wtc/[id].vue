<script setup>
const localePath = useLocalePath();
const { params: { id } } = useRoute();
const { data: piece } = await useAsyncData(`wtc/${id}`, () => queryContent(`/wtc/${id}`).findOne());

if (!piece.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
    });
}

const { data: surroundData } = await useAsyncData(`wtc/${id}/surround`, () => queryContent('/wtc').only(['_path', 'id']).findSurround(piece.value._path))
const [prevPiece, nextPiece] = surroundData.value;

const data = ref(null);
onMounted(async () => {
    const response = await fetch(piece.value.localRawFile);
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    data.value = await response.text();
});
</script>

<template>
    <UContainer>
        <div class="flex flex-col gap-8">
            <div>
                <Heading>
                    {{ piece.title }}
                </Heading>
                <div class="flex gap-2 items-center">
                    <div v-if="prevPiece">
                        <UButton :to="localePath({ name: 'piece-id', params: { id: prevPiece.id }, hash: $route.hash })">
                            <Icon name="heroicons:arrow-left-circle" class="text-xl" />
                            {{ $t('previous') }}
                        </UButton>
                    </div>
                    <div v-if="nextPiece">
                        <UButton :to="localePath({ name: 'piece-id', params: { id: nextPiece.id }, hash: $route.hash })">
                            {{ $t('next') }}
                            <Icon name="heroicons:arrow-right-circle" class="text-xl" />
                        </UButton>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex gap-2 ml-auto">
                    <UButton :to="`https://github.com/humdrum-tools/bach-wtc-fugues/blob/master/kern/${piece.id}.krn`" target="_blank">
                        Auf GitHub öffnen
                    </UButton>
                    <UButton :to="`https://verovio.humdrum.org/?file=${encodeURIComponent(`https://github.com/humdrum-tools/bach-wtc-fugues/blob/master/kern/${piece.id}.krn`)}`" target="_blank">
                        Im VHV öffnen
                    </UButton>
                </div>
            </div>

            <VerovioCanvas
                v-if="data"
                :data="data"
                :options="{
                    spacingSystem: 15,
                    pageMarginLeft: 30,
                    pageMarginRight: 30,
                    pageMarginTop: 10,
                    pageMarginBottom: 10,
                }"
            />

        </div>
    </UContainer>
</template>
