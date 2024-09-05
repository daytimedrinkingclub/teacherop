import usePageProps from '@/hooks/use_page_props'

export default function useError(): Record<string, string> | undefined {
  const props = usePageProps<{ errors?: Record<string, string> }>()

  return props.errors
}
