<template>
    <spec
        name="Icon only"
        :code="`button.button--icon
        i.fas | svg`"
        source="button.css">
        <div class="grid grid--gap--large">
            <div class="group group--gap">
                <a class="button button--icon button--large">
                    <i class="fas fa-bullseye"></i>
                </a>
                <a class="button button--primary button--icon button--large">
                    <i class="fas fa-bullseye"></i>
                </a>
                <a class="button button--secondary button--icon button--large">
                    <i class="fas fa-bullseye"></i>
                </a>

                <a class="button button--icon">
                    <i class="fas fa-bullseye"></i>
                </a>
                <a class="button button--primary button--icon">
                    <i class="fas fa-bullseye"></i>
                </a>
                <a class="button button--secondary button--icon">
                    <i class="fas fa-bullseye"></i>
                </a>

                <a class="button button--icon button--small">
                    <i class="fas fa-bullseye"></i>
                </a>
                <a class="button button--primary button--icon button--small">
                    <i class="fas fa-bullseye"></i>
                </a>
                <a class="button button--secondary button--icon button--small">
                    <i class="fas fa-bullseye"></i>
                </a>
            </div>
        </div>
    </spec>
</template>

<script>
export default {
    name: 'button-styles-icon-only'
};
</script>
