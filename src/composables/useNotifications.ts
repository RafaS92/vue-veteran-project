import { inject, provide, readonly, ref, type InjectionKey, type Ref } from 'vue'

export interface Notification {
  message: string
  tone: 'success' | 'info'
}
interface NotificationService {
  notification: Readonly<Ref<Notification | null>>
  notify: (message: string, tone?: Notification['tone']) => void
}
export const notificationKey: InjectionKey<NotificationService> = Symbol('notifications')

export function provideNotifications() {
  const notification = ref<Notification | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined
  function notify(message: string, tone: Notification['tone'] = 'success') {
    notification.value = { message, tone }
    clearTimeout(timer)
    timer = setTimeout(() => {
      notification.value = null
    }, 2800)
  }
  const service = { notification: readonly(notification), notify }
  provide(notificationKey, service)
  return service
}

export function useNotifications() {
  const service = inject(notificationKey)
  if (!service) throw new Error('Notification service was not provided')
  return service
}
