import { expect, it } from 'vitest'
import factory from '@/__tests__/factory'
import UnitTestCase from '@/__tests__/UnitTestCase'
import { artistStore, preferenceStore } from '@/stores'
import { eventBus } from '@/utils'
import { fireEvent, waitFor } from '@testing-library/vue'
import ArtistListScreen from './ArtistListScreen.vue'

new class extends UnitTestCase {
  protected beforeEach () {
    super.beforeEach(() => this.mock(artistStore, 'paginate'))
  }

  private renderComponent () {
    artistStore.state.artists = factory<Artist[]>('artist', 9)
    return this.render(ArtistListScreen)
  }

  protected test () {
    it('renders', () => {
      expect(this.renderComponent().getAllByTestId('artist-card')).toHaveLength(9)
    })

    it.each<[ArtistAlbumViewMode]>([['list'], ['thumbnails']])('sets layout from preferences', async (mode) => {
      preferenceStore.artistsViewMode = mode

      const { getByTestId } = this.renderComponent()
      eventBus.emit('ACTIVATE_SCREEN', 'Artists')

      await waitFor(() => expect(getByTestId('artist-list').classList.contains(`as-${mode}`)).toBe(true))
    })

    it('switches layout', async () => {
      const { getByTestId, getByTitle } = this.renderComponent()

      await fireEvent.click(getByTitle('View as list'))
      await waitFor(() => expect(getByTestId('artist-list').classList.contains(`as-list`)).toBe(true))

      await fireEvent.click(getByTitle('View as thumbnails'))
      await waitFor(() => expect(getByTestId('artist-list').classList.contains(`as-thumbnails`)).toBe(true))
    })
  }
}