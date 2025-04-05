import React from 'react';
import PropTypes from 'prop-types';

export const UserForm = ({ userInfo, onUserInfoChange, errors }) => {
  const handleChange = (field, value) => {
    onUserInfoChange({
      ...userInfo,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            姓 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={userInfo.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 ${
              errors.lastName ? 'border-red-500' : ''
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={userInfo.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 ${
              errors.firstName ? 'border-red-500' : ''
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            セイ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={userInfo.lastNameKana}
            onChange={(e) => handleChange('lastNameKana', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 ${
              errors.lastNameKana ? 'border-red-500' : ''
            }`}
          />
          {errors.lastNameKana && (
            <p className="mt-1 text-sm text-red-500">{errors.lastNameKana}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            メイ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={userInfo.firstNameKana}
            onChange={(e) => handleChange('firstNameKana', e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 ${
              errors.firstNameKana ? 'border-red-500' : ''
            }`}
          />
          {errors.firstNameKana && (
            <p className="mt-1 text-sm text-red-500">{errors.firstNameKana}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          電話番号 <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={userInfo.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 ${
            errors.phone ? 'border-red-500' : ''
          }`}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={userInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 ${
            errors.email ? 'border-red-500' : ''
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          ご要望・ご相談内容
        </label>
        <textarea
          value={userInfo.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
        />
      </div>
    </div>
  );
};

UserForm.propTypes = {
  userInfo: PropTypes.shape({
    lastName: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastNameKana: PropTypes.string.isRequired,
    firstNameKana: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
  }).isRequired,
  onUserInfoChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};