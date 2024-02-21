variable "gcp_zone" {
  type    = string
  default = "us-west1-a"
}

variable "ssh_username" {
  type    = string
  default = "centos"
}

variable "DBUSER" {
  type = string
  default="root"
}

variable "DBPASSWORD" {
  type = string
  default="password@123"
}

variable "DBHOST" {
  type = string
  default="localhost"
}

variable "DBPORT" {
  type = string
  default="3306"
}

variable "DBNAME" {
  type = string
  default="mydb"
}

variable "PORT" {
  type = string
  default="3000"
}

variable "gcp_project" {
  type = string
  default = "tf-gcp-infra"
}

variable "gcp_region" {
  type = string
  default = "us-west1"
}

variable "source_image" {
  type = string
  default = "centos-stream-8-v20240110"
}

variable "source_image_family" {
  type = string
  default = "centos-stream-8"
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
  project_id          = var.gcp_project
  source_image        = var.source_image
  source_image_family = var.source_image_family
  zone                = var.gcp_zone
  ssh_username        = var.ssh_username
}

# Define the build
build {
  name    = "build-gcp-custom-image"
  sources = ["source.googlecompute.centos"]

  # Define provisioners
  # Provisioner 1 - Create a local user csye6225 with primary group csye6225. User should not have a login shell
  provisioner "shell" {
    script = "packer/scripts/createUser.sh"
  }

  # Provisioner 2 - File Provisioner - Copy files
  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  # Provisioner 3 - Install Dependencies
  provisioner "shell" {
    script = "packer/scripts/install-dependencies.sh"
    environment_vars = [
      "DB_USER=${var.DBUSER}",
      "DB_PASSWORD=${var.DBPASSWORD}",
      "DB_HOST=${var.DBHOST}",
      "DB_PORT=${var.DBPORT}",
      "DB_NAME=${var.DBNAME}"
      "PORT=${var.PORT}"
    ]
  }

}