import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseInput from '../components/BaseInput.vue'
import ActionItem from '../components/ActionItem.vue'

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
})
