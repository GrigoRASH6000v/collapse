<template>
    <div 
        class="v-collapse-item"
        :class="{'is-active': isActive, 'is-disabled': disabled }"
    >
        <div
            role="tab"
            :aria-expanded="isActive"
            :aria-controls="`v-collapse-content-${id}`"
            :aria-describedby="`v-collapse-content-${id}`"
        >
            <div
                :id="`v-collapse-head-${id}`"
                class="v-collapse-item__header"
                role="button"
                :tabindex="disabled ? undefined : 0"
                
                :class="{
                    'focusing': focusing,
                    'is-active': isActive
                }"
                @keyup.space.enter.stop="handleEnterClick"
                @click="handleHeaderClick"
                @focus="handleFocus"
                @blur="focusing = false"
            >
                <slot name="title">
                    {{ title }}
                </slot>

                <div
                    class="v-collapse-item__arrow"
                    :class="{'is-active': isActive}"
                >
                    <slot name="icon">
                    </slot>
                </div>
            </div>
        </div>

        <transition
            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter"
            @before-leave="beforeLeave"
            @leave="leave"
            @@after-leave="afterLeave"
        >
            <div
                v-show="isActive"
                :id="`v-collapse-content-${id}`"
                class="v-collapse-item__wrap"
                role="tabpanel"
                :aria-hidden="!isActive"
                :aria-labelledby="`v-collapse-head-${id}`"
            >
                <div class="v-collapse-item__content">
                    <slot name="default"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>

import Emitter from '~/components/ui/collapse/mixins/emitter';
import { generateId } from './utils/util';
import { addClass, removeClass } from '~/components/ui/collapse/utils/dom';
  
export default {
    name: 'VCollapseItem',

    mixins: [Emitter],

    inject: ['collapse'],

    componentName: 'VCollapseItem',

    props: {
        title: {
            type: String,
            default: () => '',
        },

        name: {
            type: [String, Number],
            default() {
                return this._uid;
            },
        },

        customHeader: {
            type: Boolean,
            default: () => false,
        },
        
        disabled: Boolean,
    },

    data() {
        return {
            contentWrapStyle: {
                height: 'auto',
                display: 'block',
            },

            contentHeight: 0,
            focusing: false,
            isClick: false,
            id: generateId(),
        };
    },

    computed: {
        isActive() {
            return this.collapse.activeNames.indexOf(this.name) > -1;
        },
    },

    methods: {
        beforeEnter(el) {
            addClass(el, 'v-collapse-transition');

            if (!el.dataset) {
                el.dataset = {};
            } 

            el.dataset.oldPaddingTop = el.style.paddingTop;
            el.dataset.oldPaddingBottom = el.style.paddingBottom;

            el.style.height = '0';
            el.style.paddingTop = 0;
            el.style.paddingBottom = 0;
        },

        enter(el) {
            el.dataset.oldOverflow = el.style.overflow;
            if (el.scrollHeight !== 0) {
                el.style.height = el.scrollHeight + 'px';
                el.style.paddingTop = el.dataset.oldPaddingTop;
                el.style.paddingBottom = el.dataset.oldPaddingBottom;
            } else {
                el.style.height = '';
                el.style.paddingTop = el.dataset.oldPaddingTop;
                el.style.paddingBottom = el.dataset.oldPaddingBottom;
            }

            el.style.overflow = 'hidden';
        },

        afterEnter(el) {
            removeClass(el, 'v-collapse-transition');
            el.style.height = '';
            el.style.overflow = el.dataset.oldOverflow;
        },

        beforeLeave(el) {
            if (!el.dataset) {
                el.dataset = {};
            } 
            el.dataset.oldPaddingTop = el.style.paddingTop;
            el.dataset.oldPaddingBottom = el.style.paddingBottom;
            el.dataset.oldOverflow = el.style.overflow;

            el.style.height = el.scrollHeight + 'px';
            el.style.overflow = 'hidden';
        },

        leave(el) {
            if (el.scrollHeight !== 0) {
                addClass(el, 'v-collapse-transition');
                el.style.height = 0;
                el.style.paddingTop = 0;
                el.style.paddingBottom = 0;
            }
        },

        afterLeave(el) {
            removeClass(el, 'v-collapse-transition');
            el.style.height = '';
            el.style.overflow = el.dataset.oldOverflow;
            el.style.paddingTop = el.dataset.oldPaddingTop;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
        },
        

        handleFocus() {
            setTimeout(() => {
                if (!this.isClick) {
                    this.focusing = true;
                } else {
                    this.isClick = false;
                }
            }, 50);
        },

        handleHeaderClick() {
            if (this.disabled) {
                return;
            }
    
            this.dispatch('VCollapse', 'item-click', this);
            this.focusing = false;
            this.isClick = true;
        },

        handleEnterClick() {
            this.dispatch('VCollapse', 'item-click', this);
        },
    },
};
</script>

<style>
    .v-collapse-item.is-disabled .v-collapse-item__header {
        cursor: not-allowed;
    }

    .v-collapse-item__header {
        display: grid;
        grid-template-columns: 1fr auto;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        outline: 0;
        font-size: 13px;
        font-weight: 500;
        color: #303133;
        transition: border-bottom-color .3s;
        cursor: pointer;
    }

    .v-collapse-item__arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 300;
        -webkit-transition: -webkit-transform .3s;
        transition: -webkit-transform .3s;
        transition: transform .3s;
        transition: transform .3s, -webkit-transform .3s;
    }

    .v-collapse-item__arrow.is-active {
        transform: rotate(180deg);
    }

    .v-collapse-item__header.focusing:focus:not(:hover) {
        color: #409eff;
    }

    .v-collapse-item__header.is-active {
        border-bottom-color: transparent;
    }

    .v-collapse-item__wrap {
        box-sizing: border-box;
        overflow: hidden;
        will-change: height;
    }

    .v-collapse-item__content {
        font-size: 13px;
        line-height: 1.769230769230769;
        color: #303133;
    }

    .v-collapse-item:last-child {
        margin-bottom: -1px;
    }
</style>
