/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */

import { useEffect, useRef, useState } from 'react'

export type ValueObject = {
  name: string
  value: string
  imageSrc?: string
  imageStyle?: string
}

interface ModalI {
  options: ValueObject[]
  onValueChange(value: ValueObject): void
  optionSelected?: ValueObject
  placeholder?: string
  isDisable?: boolean
}

const Dropdown = ({
  options,
  onValueChange,
  optionSelected,
  placeholder,
  isDisable,
}: ModalI) => {
  const [isOpen, setIsOpen] = useState(false)

  const dropdownRef = useRef(null)

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      className={`relative ${
        isOpen && 'border-primary'
      } my-auto w-[256px] rounded-[5px] border-[1px] border-[#cfd3d8] px-[12px]  py-[15px] text-[16px] font-medium`}
      ref={dropdownRef}
    >
      <div
        onClick={() => {
          if (isDisable) {
            return
          }
          setIsOpen(!isOpen)
        }}
        className={`flex items-center justify-between ${
          !isDisable && 'cursor-pointer'
        }`}
      >
        <div className="flex justify-between gap-x-[10px]">
          {optionSelected?.imageSrc && (
            <img
              src={optionSelected.imageSrc}
              alt="image"
              className={optionSelected.imageStyle}
            />
          )}

          <div>{optionSelected?.name ?? placeholder}</div>
        </div>
        <img
          alt="ethereum avatar"
          src="/images/header/line.svg"
          className={`transition-transform duration-200 ${
            isOpen && 'rotate-180'
          }`}
        ></img>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-0  z-50 w-full translate-y-[55px] rounded-[5px] border-[1px] border-[#cfd3d8]  bg-[#fff] transition">
          <div className="grid gap-y-[5px] px-1 py-1">
            {options?.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  setIsOpen(false)
                  onValueChange(option)
                }}
                className={`flex cursor-pointer gap-x-[10px] rounded-md px-6 py-2  hover:bg-[#dbdbdb55] ${
                  optionSelected?.value === option.value && 'bg-[#dbdbdb1e]'
                }`}
              >
                {option.imageSrc && (
                  <img
                    src={option.imageSrc}
                    alt="image"
                    className={option.imageStyle}
                  />
                )}

                <div>{option.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
