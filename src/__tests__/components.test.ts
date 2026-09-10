import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseInput from '../components/BaseInput.vue'
import ActionItem from '../components/ActionItem.vue'
import LoadingState from '../components/LoadingState.vue'
import PageHeader from '../components/PageHeader.vue'
import ProgressBar from '../components/ProgressBar.vue'

describe('reusable form components', () => {
  it('supports custom v-model updates', async () => {
    const wrapper = mount(BaseInput, { props: { id: 'name', label: 'Name', modelValue: 'Jordan' } })
    await wrapper.get('input').setValue('Taylor')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Taylor'])
  })

  it('emits the action id when toggled', async () => {
    const wrapper = mount(ActionItem, {
      props: {
        item: {
          id: 'a1',
          title: 'Upload form',
          benefitId: 'b1',
          dueDate: '2026-09-20',
          completed: false,
        },
      },
    })
    await wrapper.get('input').setValue(true)
    expect(wrapper.emitted('toggle')?.[0]).toEqual(['a1'])
  })

  it('renders page heading content and actions', () => {
    const wrapper = mount(PageHeader, {
      props: {
        eyebrow: 'Resource library',
        title: 'Explore benefits',
        description: 'Browse available programs.',
      },
      slots: { actions: '<button>Filter</button>' },
    })

    expect(wrapper.get('h1').text()).toBe('Explore benefits')
    expect(wrapper.text()).toContain('Browse available programs.')
    expect(wrapper.get('button').text()).toBe('Filter')
  })

  it('announces loading messages', () => {
    const wrapper = mount(LoadingState, { props: { message: 'Loading benefits…' } })

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.text()).toContain('Loading benefits…')
  })

  it('normalizes progress values to the supported range', () => {
    const wrapper = mount(ProgressBar, { props: { value: 125 } })

    expect(wrapper.attributes('aria-valuenow')).toBe('100')
    expect(wrapper.get('span').attributes('style')).toContain('width: 100%')
  })
})
