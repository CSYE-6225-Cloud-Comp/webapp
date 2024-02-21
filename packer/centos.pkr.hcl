variable "gcp_zone" {
  type    = string
  default = "us-west1-a"
}

varibale "ssh_username" {
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
  credentials_file    = "C:\\Users\\Dell\\Downloads\\tf-gcp-infra-70afc776d951.json"
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
    script = "./scripts/create-user-and-group.sh"
  }

  # Provisioner 2 - File Provisioner - Copy files
  provisioner "file" {
    source      = "/"
    destination = "/tmp"
  }

  # Provisioner 3 - Install Dependencies
  provisioner "shell" {
    script = "./scripts/install-dependencies.sh"
  }

  # Provisioner 4 - Add systemd service file to /etc/systemd/system
  provisioner "file" {
    source      = "/webapp.service"
    destination = "/etc/systemd/system/webapp.service"
  }
}