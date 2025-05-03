provider "aws" {
  shared_credentials_files = ["~/.aws/credentials"]

  region  = var.region
  profile = var.profile

  default_tags {
    tags = {
    }
  }
}

module "ec2_role" {
  source = "terraform-aws-modules/iam/aws//modules/iam-assumable-role"
  #version = ">= 5.55"

  create_instance_profile = true
  create_role             = true

  role_name = local.role_name

  trusted_role_services = ["ec2.amazonaws.com"]

  create_custom_role_trust_policy = true
  custom_role_policy_arns = [
    "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
    "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy",
  ]
}
