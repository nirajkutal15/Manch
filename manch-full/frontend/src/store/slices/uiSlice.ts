import { createSlice, PayloadAction } from '@reduxjs/toolkit'
type ModalId = 'artist-waitlist'|'venue-waitlist'|'profile'|'apply'|'about'|'contact'|'privacy'|'post-gig'|null
interface UiState { activeModal: ModalId; modalData: Record<string,unknown>; navScrolled: boolean; }
const uiSlice = createSlice({
  name: 'ui', initialState: { activeModal:null, modalData:{}, navScrolled:false } as UiState,
  reducers: {
    openModal(s, a: PayloadAction<{id:ModalId, data?:Record<string,unknown>}>) { s.activeModal=a.payload.id; s.modalData=a.payload.data??{}; },
    closeModal(s) { s.activeModal=null; s.modalData={}; },
    setNavScrolled(s,a) { s.navScrolled=a.payload; }
  }
})
export const { openModal, closeModal, setNavScrolled } = uiSlice.actions
export default uiSlice.reducer
