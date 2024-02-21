variable "gcp_zone" {
  type    = string
  default = "us-west1-a"
}

variable "ssh_username" {
  type    = string
  default = "centos"
}

packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1.1.1"
    }
  }
}

# Build a custom image using Packer
source "googlecompute" "gcp-custom-image" {
  project_id          = "tf-gcp-infra"
  source_image        = "centos-stream-8-v20240110"
  source_image_family = "centos-stream-8"
  zone                = var.gcp_zone
  ssh_username        = var.ssh_username
}

# Define the build
build {
  name    = "build-gcp-custom-image"
  sources = ["source.googlecompute.gcp-custom-image"]

  # Define provisioners
  # Provisioner 1 - Create a local user csye6225 with primary group csye6225. User should not have a login shell
  provisioner "shell" {
    # Path to the shell script
    script = "packer/scripts/createUser.sh"
  }

  # Provisioner 2 - File Provisioner - Copy files
  provisioner "file" {
    source      = "/"
    destination = "/tmp"
  }

  # Provisioner 3 - Install Dependencies
  provisioner "shell" {
    script = "packer/scripts/install-dependencies.sh"
  }

  # Provisioner 4 - Add systemd service file to /etc/systemd/system
  provisioner "file" {
    source      = "packer/webapp.service"
    destination = "/etc/systemd/system/webapp.service"
  }
}