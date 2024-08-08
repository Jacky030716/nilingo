"use client"

import { useSettingModal } from "@/store/use_setting_modal"
import Select, { SingleValue } from "react-select"
import { useEffect, useState, useTransition } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import Image from "next/image"
import { Button } from "../ui/button"
import { Earth } from "lucide-react"
import { updateUserLanguageSetting } from "@/actions/user-setting"
import { toast } from "sonner"
import { Slider } from "@/components/ui/slider"

type VoiceOption = {
  label: string;
  value: string;
  index: number;
}

type Props = {
  initialSettings: { speed: number, volume: number };
  setInitialSettings: (settings: { speed: number, volume: number }) => void;
}

const SettingModal = ({
  initialSettings,
  setInitialSettings
}: Props) => {
  const [isClient, setIsClient] = useState(false)

  const [voice, setVoice] = useState<VoiceOption[]>([]);
  const [choice, setChoice] = useState<VoiceOption | null>(null);
  const [pending, startTransition] = useTransition();
  const { isOpen, closeModal } = useSettingModal()
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const getVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const reducedVoices = voices.map((v, i) => ({
        label: v.lang + "-" + v.voiceURI,
        value: v.lang + v.voiceURI,
        index: i
      }))
      setVoice(reducedVoices)
    };

    // Add event listener for voiceschanged
    window.speechSynthesis.onvoiceschanged = getVoices;

    // Call getVoices initially in case the voices are already loaded
    getVoices();
  
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isOpen]);

  const handleSelectChange = (selectedOption: SingleValue<VoiceOption>) => {
    setChoice(selectedOption as VoiceOption);
  };

  const handleClick = () => {
    startTransition(() => {
      updateUserLanguageSetting(choice?.index || 0)
        .then(() => {
          toast.success("Language setting updated")
        })
        .catch(() => {
          toast.error("Something went wrong")
        });
    })
  }

  if(!isClient) return null

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeModal}
    >
      <DialogContent
        className="max-w-2xl"
      >
        <DialogHeader>
          <div className="flex items-center w-full justify-center">
            <Image 
              src="/assets/setting.svg"
              alt="Parrot"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle>
            <h2 className="text-2xl font-bold text-center">
              Settings
            </h2>
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="flex flex-col gap-y-8 w-full">
            <div className="flex flex-col w-full gap-x-2">
              <div className="flex items-center mb-1">
                <Earth 
                  size={16}
                  className="mr-2 text-neutral-500"
                />
                <p className="text-neutral-500 font-semibold">
                  Language spoken
                </p>
              </div>
              <div className="flex gap-x-2">
                <Select 
                  isSearchable
                  options={voice}
                  className='flex-1'
                  onChange={handleSelectChange}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClick}
                  disabled={pending}
                >
                  Save Changes
                </Button>
              </div>
              
            </div>
            <div className="flex flex-col w-full gap-x-2">
              <div className="flex items-center mb-2">
                <Earth 
                  size={16}
                  className="mr-2 text-neutral-500"
                />
                <p className="text-neutral-500 font-semibold mr-2">
                  Speed
                </p>
                <span className="font-bold tetx-sm">
                  {initialSettings.speed}x
                </span>
              </div>
              <div className="flex gap-x-2">
                <Slider 
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={(v) => setInitialSettings({ ...initialSettings, speed: v[0] })}
                  defaultValue={[initialSettings.speed]}
                />
              </div>
            </div>
            <div className="flex flex-col w-full gap-x-2">
              <div className="flex items-center mb-2">
                <Earth 
                  size={16}
                  className="mr-2 text-neutral-500"
                />
                <p className="text-neutral-500 font-semibold mr-2">
                  Volume
                </p>
                <span className="font-bold tetx-sm">
                  {initialSettings.volume}x
                </span>
              </div>
              <div className="flex gap-x-2">
                <Slider 
                  min={0.1}
                  max={1}
                  step={0.1}
                  onValueChange={(v) => setInitialSettings({ ...initialSettings, volume: v[0] })}
                  defaultValue={[initialSettings.volume]}
                />
              </div>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SettingModal
