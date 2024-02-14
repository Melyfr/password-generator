import { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import './App.css'

type Inputs = {
  length: number
  settings: string[]
}

const App = () => {
  const [password, setPassword] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      length: 12,
      settings: ['numbers', 'lowercase', 'uppercase', 'symbols'],
    }
  });

  const onSubmit:SubmitHandler<Inputs> = (data) => {
    setPassword(generatePassword(data));
  };

  const getRandomInt = (range:number):number => {       
    const byteArray = new Uint8Array(1);
    const max_range = 256;

    window.crypto.getRandomValues(byteArray);
    if (byteArray[0] >= Math.floor(max_range / range) * range) {
      return getRandomInt(range);
    }

    return byteArray[0] % range;
}

  const generatePassword = ({length, settings}:Inputs):string => {
    let alphabet = '';
    let result = '';

    if (settings.includes('numbers')) {
      alphabet += '0123456789';
    }
    if (settings.includes('lowercase')) {
      alphabet += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (settings.includes('uppercase')) {
      alphabet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (settings.includes('symbols')) {
      alphabet += '!@#$%^&*(){}[]=<>/,.';
    } 
    
    for (let i = 0; i < length; i++) {
        result += alphabet[getRandomInt(alphabet.length)];
    }

    return result;
  };

  const copyToClipboard = () => {
    const tempInput = document.createElement('input');
    tempInput.value = password;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  const settingsValidate = (selectedMediums: string[]):boolean => {
    return selectedMediums.length > 0;
  }

  return (
    <div className="container">
      <div className="form">
        <p className="form__subtitle">Your password:</p>
        <div className="form__password-container"><span className="form__password">{password}</span><button className="form__copy" onClick={copyToClipboard} /></div>
        <form onSubmit={handleSubmit(onSubmit)}>

          <p className="form__subtitle">Length</p>
          <label className="form__label">
            <input {...register("length", { required: true, min: 4, max: 28})} type="range" className="form__range" min='4' max='28'/>
            <span>{watch('length')}</span>
          </label>

          <p className="form__subtitle">Settings</p>

          <label className="form__label">
            Numbers:
            <input {...register("settings", {validate: settingsValidate})} value='numbers' id="checkbox1" type="checkbox" className="form__checkbox"/>
            <label htmlFor="checkbox1" className="form__label-checkbox"></label>
          </label>

          <label className="form__label">
            Lowercase characters:
            <input {...register("settings", {validate: settingsValidate})} value='lowercase'  id="checkbox2" type="checkbox" className="form__checkbox"/>
            <label htmlFor="checkbox2" className="form__label-checkbox"></label>
          </label>

          <label className="form__label">
            Uppercase characters:
            <input {...register("settings", {validate: settingsValidate})} value='uppercase' id="checkbox3" type="checkbox" className="form__checkbox"/>
            <label htmlFor="checkbox3" className="form__label-checkbox"></label>
          </label>

          <label className="form__label">
            Symbols:
            <input {...register("settings", {validate: settingsValidate})} value='symbols' id="checkbox4"  type="checkbox" className="form__checkbox"/>
            <label htmlFor="checkbox4" className="form__label-checkbox"></label>
          </label>
          
          <input type="submit" value='Generate' className="form__btn"/>
        </form>

        <span className={errors.settings ? "form__error form__error--active" : "form__error"}>At least one checkbox must be selected</span>
      </div>

    </div>
  )
}

export default App;
