output "ec2_role" {
  value = {
    profile_name = module.ec2_role.iam_instance_profile_name
  }
}
