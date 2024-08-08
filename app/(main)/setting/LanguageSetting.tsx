"use client"

import { updateUserLanguageSetting } from '@/actions/user-setting'
import { Button } from '@/components/ui/button'
import { userSettings } from '@/db/schema'
import { Earth } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import Select, { SingleValue } from 'react-select'
import { toast } from 'sonner'

type VoiceOption= {
  label: string;
  value: string;
  index: number;
}

type Props = {
  languageData: typeof userSettings.$inferSelect
}

const LanguageSetting = ({languageData}: Props) => {
  const [voice, setVoice] = useState<VoiceOption[]>([]);
  const [choice, setChoice] = useState<VoiceOption | null>(null);
  const [_, startTransition] = useTransition();
  
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
  
    // Cleanup event listener on component unmount
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

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

  return (
    <div className='flex justify-between items-center w-full gap-x-3'>
      <Earth 
      className=''
      />
      <Select 
        isSearchable
        options={voice}
        defaultInputValue={voice[languageData.language]?.label || "Select a language"}
        className='flex-1'
        onChange={handleSelectChange}
      />
      <Button
        variant="secondary"
        size="sm"
        onClick={handleClick}
      >
        Save Changes
      </Button>
    </div>
  )
}

export default LanguageSetting