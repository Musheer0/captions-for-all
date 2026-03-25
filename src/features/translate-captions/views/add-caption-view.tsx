"use client"
import { CaptionStep, useCaptionFlowStore } from '../stores/caption-flow-store'
import SelectVideo from '../components/select-videos'
import SelectedVideosList from '../components/selected-videos-list'
import CaptionSettings from '../components/caption-settings'
import AddCaptionButton from '../components/add-caption-to-video-button'

const AddCaptionView = () => {
    const {step} = useCaptionFlowStore()
  return (
    <div  className=' flex-col    relative overflow-y-auto  min-h-0  flex-1 p-2'>
         
      {step===CaptionStep.SELECT_VIDEO &&
      <SelectVideo/>
      }
      {step===CaptionStep.CAPTION_SETTINGS &&
      <>
      <SelectedVideosList/>
      <CaptionSettings/>
      <AddCaptionButton/>
      </>
      }
    
    </div>
  )
}

export default AddCaptionView