# frozen_string_literal: true

class DeviceApi::DevicesController < DeviceApi::ApplicationController
  def find
    authorize :find, policy_class: DeviceApi::DeviceApiPolicy

    device = Device.find_by!(
      brand: device_params[:brand], device_type: device_params[:device_type],
      serial_number: device_params[:serial_number])

    render :create, locals: {
      device:
    }
  end

  def create
    authorize :create, policy_class: DeviceApi::DeviceApiPolicy
    render :create, locals: {
      device: Device.create!(device_params)
    }
  end

  def update_availability
    authorize :update_availability, policy_class: DeviceApi::DeviceApiPolicy

    if device.update(available: device_params[:available])
      render json: {
        success: true,
        device:,
        notice: I18n.t("device.update.success.message")
      }, status: :ok
    else
      render json: {
        success: false,
        approved_device_usage: last_usage_request,
        notice: I18n.t("device_usage.update.failure.message")
      }, status: :unprocessable_entity
    end
  end

  private

    def device
      @_device ||= Device.find(params[:id])
    end

    def device_params
      params.require(:device).permit(
        policy(Device).permitted_attributes
      )
    end
end
