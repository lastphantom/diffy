'use client'
import produce from 'immer'
import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import {
  useFeatures,
  useFeaturesStore,
} from '../../hooks'
import type { OnFeaturesChange } from '../../types'
import classNames from '@/utils/classnames'
import type { Item } from '@/app/components/base/select'
import Tooltip from '@/app/components/base/tooltip'
import { shortenLanguages } from '@/i18n/language'
import RadioGroup from '@/app/components/app/configuration/config-vision/radio-group'
import { LanguageRecognition } from '@/types/app'

type SpeechtotextParamConfigProps = {
  onChange?: OnFeaturesChange
}
const SpeechToTextParamConfig = ({
  onChange,
}: SpeechtotextParamConfigProps) => {
  const { t } = useTranslation()
  const speech2text = useFeatures(state => state.features.speech2text)
  const featuresStore = useFeaturesStore()

  const languageItem = useMemo(() => {
    return shortenLanguages.find(item => item.value === speech2text?.language)
  }, [speech2text?.language])

  const handleChange = (value: Record<string, string>) => {
    const {
      features,
      setFeatures,
    } = featuresStore!.getState()

    const newFeatures = produce(features, (draft) => {
      draft.speech2text = {
        ...draft.speech2text,
        ...value,
      }
    })

    setFeatures(newFeatures)
    if (onChange)
      onChange(newFeatures)
  }

  return (
    <div>
      <div className='leading-6 text-base font-semibold text-gray-800'>{t('appDebug.speechToText.speechToTextSettings.title')}</div>
      <div className='pt-3 space-y-6'>
        <div
          className='mb-2 leading-[18px] text-[13px] font-semibold text-gray-800'>{t('appDebug.speechToText.speechToTextSettings.languageRecognition')}</div>
        <RadioGroup
          className='space-x-3'
          options={[
            {
              label: t('appDebug.speechToText.speechToTextSettings.auto'),
              value: LanguageRecognition.auto,
            },
            {
              label: t('appDebug.speechToText.speechToTextSettings.custom'),
              value: LanguageRecognition.custom,
            },
          ]}
          value={speech2text?.language_recognition}
          onChange={(value: LanguageRecognition) => {
            handleChange({
              language_recognition: value,
            })
          }}
        />
      </div>
      { speech2text?.enabled && speech2text?.language_recognition === LanguageRecognition.custom
        && <div className='pt-3 space-y-6'>
          <div>
            <div className='mb-2 flex items-center  space-x-1'>
              <div className='leading-[18px] text-[13px] font-semibold text-gray-800'>{t('appDebug.voice.voiceSettings.language')}</div>
              <Tooltip
                popupContent={
                  <div className='w-[180px]'>
                    {t('appDebug.speechToText.speechToTextSettings.resolutionTooltip').split('\n').map(item => (
                      <div key={item}>{item}</div>
                    ))}
                  </div>
                }
              />

            </div>
            <Listbox
              value={languageItem}
              onChange={(value: Item) => {
                handleChange({
                  language: String(value.value),
                })
              }}
            >
              <div className={'relative h-9'}>
                <Listbox.Button
                  className={'w-full h-full rounded-lg border-0 bg-gray-100 py-1.5 pl-3 pr-10 sm:text-sm sm:leading-6 focus-visible:outline-none focus-visible:bg-gray-200 group-hover:bg-gray-200 cursor-pointer'}>
                  <span className={classNames('block truncate text-left', !languageItem?.name && 'text-gray-400')}>
                    {languageItem?.name ? t(`common.speechtotext.language.${languageItem?.value}`) : languageItem?.name}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >

                  <Listbox.Options
                    className="absolute z-10 mt-1 px-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg border-gray-200 border-[0.5px] focus:outline-none sm:text-sm">
                    {shortenLanguages.map((item: Item) => (
                      <Listbox.Option
                        key={item.value}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-3 pr-9 rounded-lg hover:bg-gray-100 text-gray-700 ${active ? 'bg-gray-100' : ''
                          }`
                        }
                        value={item}
                        disabled={false}
                      >
                        {({ /* active, */ selected }) => (
                          <>
                            <span
                              className={classNames('block', selected && 'font-normal')}>{t(`common.speechtotext.language.${(item.value).toString()}`)}</span>
                            {(selected || item.value === speech2text?.language) && (
                              <span
                                className={classNames(
                                  'absolute inset-y-0 right-0 flex items-center pr-4 text-gray-700',
                                )}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>
      }
    </div>
  )
}

export default React.memo(SpeechToTextParamConfig)