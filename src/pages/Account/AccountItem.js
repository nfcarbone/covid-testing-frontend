import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import * as tools from '../../tools/tools.js';
import { SetNavDisabled } from '../../Providers/ContextProvider.js';

const Saving = () => <h1>Saving...</h1>;

const AccountItem = ({ title, field, items, input, setContext, setHeader }) => {
  console.log('rendering: ' + field);

  const setNavDisabled = useContext(SetNavDisabled);

  const [userError, setUserError] = useState('');
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [prevInput, setPrevInput] = useState(input);
  const [preview, setPreview] = useState('');

  // preview item
  useEffect(() => {
    if (field === 'password') return;
    if (field === 'name') {
      setPreview(`${input.firstName} ${input.lastName}`);
    } else {
      setPreview(input[items[0].key]);
    }
  }, [field, input, items]);

  const toggleEdit = () => {
    if (saving) return;
    if (!edit) {
      setEdit(true);
    } else {
      if (updated) {
        save();
      }
      setEdit(false);
    }
  };

  const togglePassword = () => {
    if (!edit) {
      toggleEdit();
    } else {
      if (!tools.validPassword(input.newPassword))
        return setUserError('Invalid password');
      if (input.newPassword !== input.confirmNewPassword)
        return setUserError("Confirmation doesn't match");
      let submitInput = { ...input };
      delete submitInput.confirmNewPassword;
      toggleEdit();
    }
  };

  const handleInput = (e, key) => {
    let val = e.target.value;
    if (key === 'zip' && val && val[val.length - 1].match(/\D/)) return;
    setUpdated(val !== prevInput[key]);
    setContext({ ...input, [key]: val });
  };

  const save = async () => {
    try {
      setSaving(true);
      setNavDisabled(true);
      const res = await axios.post(`/common/update/${field}`, input);
      if (field === 'password') {
        setContext(prevInput);
      } else {
        if (field === 'name') setHeader(res.data.name.firstName);
        setContext(res.data[field]);
        setPrevInput(res.data[field]);
      }
      setUpdated(false);
    } catch (e) {
      const userError = e.hasOwnProperty('response')
        ? e.response.data
        : e.message;
      setUserError(userError);
    } finally {
      setSaving(false);
      setNavDisabled(false);
    }
  };

  const cancel = (e) => {
    e.stopPropagation();
    setContext(prevInput);
    setUpdated(false);
    setEdit(false);
  };

  return saving ? (
    <Saving />
  ) : (
    <div className='account-item'>
      <div
        className='account-item-top'
        onClick={field === 'password' ? togglePassword : toggleEdit}
      >
        <div className='account-item-text'>
          <h2>{title}</h2>
          <p className='info-small'>{preview}</p>
          {userError && <p>{userError}</p>}
        </div>
        <button type='button'>{edit ? 'save' : 'edit'}</button>
        {edit && (
          <button type='button' onClick={cancel}>
            Cancel
          </button>
        )}
      </div>
      {edit &&
        items.map((item, index) => {
          return (
            <div key={index} className='account-item-input-div'>
              <label htmlFor={field + item.key} className='label-small'>
                {item.label}
              </label>
              <input
                type={item.type}
                id={field + item.key}
                maxLength={item.key === 'zip' ? '5' : '99'}
                placeholder={
                  item.key === 'currentPassword' || item.key === 'id'
                    ? '[hidden]'
                    : ''
                }
                value={input[item.key]}
                onChange={(e) => handleInput(e, item.key)}
              />
            </div>
          );
        })}
    </div>
  );
};

export default AccountItem;
