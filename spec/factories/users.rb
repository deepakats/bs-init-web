# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    first_name { Faker::Name.first_name.gsub(/\W/, "") }
    last_name { Faker::Name.last_name.gsub(/\W/, "") }
    email { Faker::Internet.safe_email }
    password { Faker::Internet.password }
    confirmed_at { Date.today }
    current_workspace factory: :company

    trait :with_avatar do
      after :build do |user|
        file_name = "test-image.png"
        file_path = Rails.root.join("spec", "support", "fixtures", file_name)
        user.avatar.attach(io: File.open(file_path), filename: file_name, content_type: "image/png")
      end
    end

    trait :with_pending_invitation do
      invitation_token { Faker::String.random(length: 10) }
      invitation_created_at { Time.current }
    end
  end
end
